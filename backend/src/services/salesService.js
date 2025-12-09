// backend/src/services/salesService.js
const db = require('../db/sqlite');
const { parseArrayParam, parseNumber, parseDate } = require('../utils/queryParser');

function getFilteredSortedPaginatedSales(query) {
  const {
    search,
    regions,
    genders,
    productCategories,
    tags,
    paymentMethods,
    ageMin,
    ageMax,
    dateFrom,
    dateTo,
    sortBy,
    sortOrder,
    page,
    pageSize
  } = normalizeQuery(query);

  // Build WHERE clause and params for SQLite
  const whereParts = [];
  const params = {};

  // Search: customerName (case-insensitive) OR phoneNumber
  if (search) {
    const s = search.toLowerCase();
    whereParts.push('(LOWER(customerName) LIKE @searchName OR phoneNumber LIKE @searchPhone)');
    params.searchName = `%${s}%`;
    params.searchPhone = `%${search}%`;
  }

  // Multi-select filters
  addInFilter(whereParts, params, 'customerRegion', 'regions', regions);
  addInFilter(whereParts, params, 'gender', 'genders', genders);
  addInFilter(whereParts, params, 'productCategory', 'productCategories', productCategories);
  addInFilter(whereParts, params, 'paymentMethod', 'paymentMethods', paymentMethods);

  // Tags: record must have ANY of the selected tags
  if (tags.length) {
    const tagConds = [];
    tags.forEach((t, idx) => {
      const key = `tag${idx}`;
      // simple LIKE match, enough for assignment
      params[key] = `%${t}%`;
      tagConds.push(`tags LIKE @${key}`);
    });
    if (tagConds.length) {
      whereParts.push(`(${tagConds.join(' OR ')})`);
    }
  }

  // Age range
  if (ageMin !== null) {
    whereParts.push('age >= @ageMin');
    params.ageMin = ageMin;
  }
  if (ageMax !== null) {
    whereParts.push('age <= @ageMax');
    params.ageMax = ageMax;
  }

  // Date range (stored as ISO string)
  if (dateFrom) {
    whereParts.push('date >= @dateFrom');
    params.dateFrom = dateFrom.toISOString();
  }
  if (dateTo) {
    whereParts.push('date <= @dateTo');
    params.dateTo = dateTo.toISOString();
  }

  const whereClause = whereParts.length ? `WHERE ${whereParts.join(' AND ')}` : '';

  // 1️⃣ Total count
  const countRow = db
    .prepare(`SELECT COUNT(*) AS count FROM sales ${whereClause}`)
    .get(params);
  const totalItems = countRow.count || 0;

  const safePageSize = pageSize;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const offset = (safePage - 1) * safePageSize;

  // 2️⃣ Summary (total units, total amount, total discount)
  const summaryRow = db
    .prepare(
      `
      SELECT 
        COALESCE(SUM(quantity), 0)          AS totalUnits,
        COALESCE(SUM(finalAmount), 0)       AS totalAmount,
        COALESCE(SUM(totalAmount - finalAmount), 0) AS totalDiscount
      FROM sales
      ${whereClause}
      `
    )
    .get(params);

  const summary = {
    totalUnits: summaryRow.totalUnits || 0,
    totalAmount: summaryRow.totalAmount || 0,
    totalDiscount: summaryRow.totalDiscount || 0
  };

  // INR -> SR conversion for summary
  const INR_TO_SR = 0.04515;
  summary.totalAmountSR = summary.totalAmount * INR_TO_SR;
  summary.totalDiscountSR = summary.totalDiscount * INR_TO_SR;

  // 3️⃣ Sorting
  let orderBy = 'date DESC'; // default: newest first
  const dir = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

  if (sortBy === 'date') {
    orderBy = `date ${dir}`;
  } else if (sortBy === 'quantity') {
    orderBy = `quantity ${dir}`;
  } else if (sortBy === 'customerName') {
    orderBy = `customerName COLLATE NOCASE ${dir}`;
  }

  const querySql = `
    SELECT
      transactionId, date,
      customerId, customerName, phoneNumber, gender, age, customerRegion, customerType,
      productId, productName, brand, productCategory, tags,
      quantity, pricePerUnit, discountPercentage, totalAmount, finalAmount,
      paymentMethod, orderStatus, deliveryType,
      storeId, storeLocation,
      salespersonId, employeeName
    FROM sales
    ${whereClause}
    ORDER BY ${orderBy}
    LIMIT @limit OFFSET @offset
  `;

  const pageParams = { ...params, limit: safePageSize, offset };
  const rows = db.prepare(querySql).all(pageParams);

  const pageData = rows.map(r => ({
    transactionId: r.transactionId,
    date: r.date ? new Date(r.date) : null,

    customerId: r.customerId,
    customerName: r.customerName,
    phoneNumber: r.phoneNumber,
    gender: r.gender,
    age: r.age,
    customerRegion: r.customerRegion,
    customerType: r.customerType,

    productId: r.productId,
    productName: r.productName,
    brand: r.brand,
    productCategory: r.productCategory,
    tags: r.tags
      ? r.tags
          .split(',')
          .map(t => t.trim())
          .filter(Boolean)
      : [],

    quantity: r.quantity,
    pricePerUnit: r.pricePerUnit,
    discountPercentage: r.discountPercentage,
    totalAmount: r.totalAmount,
    finalAmount: r.finalAmount,

    paymentMethod: r.paymentMethod,
    orderStatus: r.orderStatus,
    deliveryType: r.deliveryType,

    storeId: r.storeId,
    storeLocation: r.storeLocation,

    salespersonId: r.salespersonId,
    employeeName: r.employeeName
  }));

  return {
    data: pageData,
    page: safePage,
    pageSize: safePageSize,
    totalItems,
    totalPages,
    summary
  };
}

function normalizeQuery(query) {
  return {
    search: query.search || '',
    regions: parseArrayParam(query.regions),
    genders: parseArrayParam(query.genders),
    productCategories: parseArrayParam(query.productCategories),
    tags: parseArrayParam(query.tags),
    paymentMethods: parseArrayParam(query.paymentMethods),

    ageMin: parseNumber(query.ageMin, null),
    ageMax: parseNumber(query.ageMax, null),

    dateFrom: parseDate(query.dateFrom, null),
    dateTo: parseDate(query.dateTo, null),

    sortBy: query.sortBy || 'date',
    sortOrder: query.sortOrder || 'desc',

    page: parseNumber(query.page, 1) || 1,
    pageSize: 10
  };
}

// For /api/sales/filters
function getFilterOptions() {
  const uniqFromCol = col => {
    const rows = db
      .prepare(
        `SELECT DISTINCT ${col} AS v FROM sales WHERE ${col} IS NOT NULL AND ${col} <> '' ORDER BY v`
      )
      .all();
    return rows.map(r => r.v);
  };

  // Tags need splitting
  const tagRows = db
    .prepare(
      `SELECT tags FROM sales WHERE tags IS NOT NULL AND tags <> ''`
    )
    .all();
  const tagSet = new Set();
  tagRows.forEach(r => {
    r.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)
      .forEach(t => tagSet.add(t));
  });

  return {
    regions: uniqFromCol('customerRegion'),
    genders: uniqFromCol('gender'),
    productCategories: uniqFromCol('productCategory'),
    tags: Array.from(tagSet).sort(),
    paymentMethods: uniqFromCol('paymentMethod')
  };
}

// Helper to build IN (...) filter
function addInFilter(whereParts, params, columnName, paramPrefix, values) {
  if (!values || !values.length) return;
  const placeholders = [];
  values.forEach((val, idx) => {
    const key = `${paramPrefix}_${idx}`;
    placeholders.push(`@${key}`);
    params[key] = val;
  });
  whereParts.push(`${columnName} IN (${placeholders.join(', ')})`);
}

module.exports = {
  getFilteredSortedPaginatedSales,
  getFilterOptions
};
