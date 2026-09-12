const express = require('express');
const router = express.Router();
const { categoriesController, suppliersController, supplierDetailController } = require('../controllers/discovery.controller');

router.get('/categories', categoriesController);
router.get('/suppliers', suppliersController);
router.get('/suppliers/:id', supplierDetailController);

module.exports = router;
