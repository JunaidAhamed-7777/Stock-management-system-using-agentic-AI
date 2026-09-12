const express = require('express');
const router = express.Router();
const { listProducts, productDetails, createProductController, updateProductController, deleteProductController } = require('../controllers/product.controller');
const { authorize } = require('../middleware/authorize');

router.get('/', listProducts);
router.get('/:id', productDetails);
router.post('/', authorize('ADMIN', 'SUPPLIER'), createProductController);
router.put('/:id', authorize('ADMIN', 'SUPPLIER'), updateProductController);
router.delete('/:id', authorize('ADMIN'), deleteProductController);

module.exports = router;
