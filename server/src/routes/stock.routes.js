const express = require('express');
const router = express.Router();
const { lowStockController, adjustStockController, getStockTransactionsController } = require('../controllers/stock.controller');
const { authorize } = require('../middleware/authorize');

router.get('/low-stock', lowStockController);
router.get('/transactions', authorize('ADMIN', 'SUPPLIER'), getStockTransactionsController);
router.patch('/adjust', authorize('ADMIN', 'SUPPLIER'), adjustStockController);

module.exports = router;
