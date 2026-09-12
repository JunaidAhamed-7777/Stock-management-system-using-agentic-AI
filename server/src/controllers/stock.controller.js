const { getLowStock, adjustStock } = require('../services/stockService');

const lowStockController = async (req, res, next) => {
  try {
    const products = await getLowStock(req.user);
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

const adjustStockController = async (req, res, next) => {
  try {
    const { productId, quantityChange, reason } = req.body;
    const result = await adjustStock({ productId, quantityChange, reason }, req.user);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const getStockTransactionsController = async (req, res, next) => {
  try {
    res.status(501).json({ success: false, code: 'NOT_IMPLEMENTED', message: 'Stock transaction listing not implemented yet.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  lowStockController,
  adjustStockController,
  getStockTransactionsController,
};
