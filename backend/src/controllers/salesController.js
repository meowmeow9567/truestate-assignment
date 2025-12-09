const {
  getFilteredSortedPaginatedSales,
  getFilterOptions
} = require('../services/salesService');

function getSales(req, res) {
  try {
    const result = getFilteredSortedPaginatedSales(req.query);
    res.json(result);
  } catch (err) {
    console.error('Error in getSales:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function getFilters(req, res) {
  try {
    const options = getFilterOptions();
    res.json(options);
  } catch (err) {
    console.error('Error in getFilters:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getSales,
  getFilters
};
