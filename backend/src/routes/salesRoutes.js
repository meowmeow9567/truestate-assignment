const express = require('express');
const router = express.Router();
const { getSales, getFilters } = require('../controllers/salesController');

// GET /api/sales?search=&regions=&genders=&productCategories=&tags=&paymentMethods=&ageMin=&ageMax=&dateFrom=&dateTo=&sortBy=&sortOrder=&page=
router.get('/', getSales);

// GET /api/sales/filters
router.get('/filters', getFilters);

module.exports = router;
