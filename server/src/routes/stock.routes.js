const express = require('express');
const router = express.Router();
const { lowStockController, adjustStockController } = require('../controllers/stock.controller');
const { authorize } = require('../middleware/authorize');

router.get('/low-stock', lowStockController);
router.patch('/adjust', authorize('ADMIN', 'SUPPLIER'), adjustStockController);

module.exports = router;
