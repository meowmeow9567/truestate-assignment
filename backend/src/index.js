// backend/src/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const app = express();

// Render provides PORT; local fallback for testing
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", db: "postgres" });
});

// Sales list with pagination + summary
app.get("/api/sales", async (req, res) => {
  const page = parseInt(req.query.page || "1", 10);
  const limit = parseInt(req.query.limit || "20", 10);
  const offset = (page - 1) * limit;

  try {
    // 1) Paginated rows
    const dataResult = await pool.query(
      "SELECT * FROM sales ORDER BY id LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    // 2) Total rows (for pagination)
    const countResult = await pool.query("SELECT COUNT(*) AS count FROM sales");

    // 3) Summary across all sales
    const summaryResult = await pool.query(`
      SELECT
        COALESCE(SUM(quantity), 0)                    AS total_units_sold,
        COALESCE(SUM(final_amount), 0)                AS total_amount,
        COALESCE(SUM(total_amount - final_amount), 0) AS total_discount
      FROM sales
    `);

    const summaryRow = summaryResult.rows[0];

    // 4) Normalize each row: snake_case + camelCase + tags[]
    const rows = dataResult.rows.map((row) => {
      const tagsArray = row.tags
        ? String(row.tags)
            .split(",")
            .map((t) => t.trim())
        : [];

      const camel = {
        customerId: row.customer_id,
        customerName: row.customer_name,
        phoneNumber: row.phone_number,
        customerRegion: row.customer_region,
        customerType: row.customer_type,

        productId: row.product_id,
        productName: row.product_name,

        pricePerUnit: row.price_per_unit,
        discountPercentage: row.discount_percentage,
        totalAmount: row.total_amount,
        finalAmount: row.final_amount,

        paymentMethod: row.payment_method,
        orderStatus: row.order_status,
        deliveryType: row.delivery_type,

        storeId: row.store_id,
        storeLocation: row.store_location,
        salespersonId: row.salesperson_id,
        employeeName: row.employee_name,
      };

      return {
        ...row,     // snake_case fields
        ...camel,   // camelCase fields
        tags: tagsArray,
      };
    });

    res.json({
      success: true,
      total: Number(countResult.rows[0].count),
      page,
      limit,
      data: rows,
      summary: {
        // expose summary with multiple names so frontend surely picks it
        totalUnitsSold: Number(summaryRow.total_units_sold),
        totalUnits: Number(summaryRow.total_units_sold),
        unitsSold: Number(summaryRow.total_units_sold),
        total_units_sold: Number(summaryRow.total_units_sold),

        totalAmount: Number(summaryRow.total_amount),
        total_amount: Number(summaryRow.total_amount),

        totalDiscount: Number(summaryRow.total_discount),
        total_discount: Number(summaryRow.total_discount),
      },
    });
  } catch (err) {
    console.error("❌ Error fetching sales", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
});

// Filter metadata API
app.get("/api/sales/filters", async (req, res) => {
  try {
    const [
      regionsRes,
      gendersRes,
      customerTypesRes,
      categoriesRes,
      brandsRes,
      tagsRes,
      paymentMethodsRes,
      orderStatusesRes,
      deliveryTypesRes,
      storeLocationsRes,
      dateRangeRes,
    ] = await Promise.all([
      pool.query(
        "SELECT DISTINCT customer_region FROM sales ORDER BY customer_region"
      ),
      pool.query("SELECT DISTINCT gender FROM sales ORDER BY gender"),
      pool.query(
        "SELECT DISTINCT customer_type FROM sales ORDER BY customer_type"
      ),
      pool.query(
        "SELECT DISTINCT product_category FROM sales ORDER BY product_category"
      ),
      pool.query("SELECT DISTINCT brand FROM sales ORDER BY brand"),
      pool.query("SELECT DISTINCT tags FROM sales"),
      pool.query(
        "SELECT DISTINCT payment_method FROM sales ORDER BY payment_method"
      ),
      pool.query(
        "SELECT DISTINCT order_status FROM sales ORDER BY order_status"
      ),
      pool.query(
        "SELECT DISTINCT delivery_type FROM sales ORDER BY delivery_type"
      ),
      pool.query(
        "SELECT DISTINCT store_location FROM sales ORDER BY store_location"
      ),
      pool.query("SELECT MIN(date) AS min_date, MAX(date) AS max_date FROM sales"),
    ]);

    const tagSet = new Set();
    tagsRes.rows.forEach((row) => {
      if (!row.tags) return;
      String(row.tags)
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .forEach((t) => tagSet.add(t));
    });

    res.json({
      regions: regionsRes.rows.map((r) => r.customer_region),
      genders: gendersRes.rows.map((r) => r.gender),
      customerTypes: customerTypesRes.rows.map((r) => r.customer_type),
      productCategories: categoriesRes.rows.map((r) => r.product_category),
      brands: brandsRes.rows.map((r) => r.brand),
      tags: Array.from(tagSet),
      paymentMethods: paymentMethodsRes.rows.map((r) => r.payment_method),
      orderStatuses: orderStatusesRes.rows.map((r) => r.order_status),
      deliveryTypes: deliveryTypesRes.rows.map((r) => r.delivery_type),
      storeLocations: storeLocationsRes.rows.map((r) => r.store_location),
      dateRange: {
        min: dateRangeRes.rows[0].min_date,
        max: dateRangeRes.rows[0].max_date,
      },
    });
  } catch (err) {
    console.error("❌ Error fetching filters", err);
    res.status(500).json({
      success: false,
      message: "Failed to load filters",
      error: err.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});
