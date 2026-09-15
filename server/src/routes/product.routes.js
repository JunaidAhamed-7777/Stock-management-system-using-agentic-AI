const express = require('express');
const publicRouter = express.Router();
const protectedRouter = express.Router();
const { listProducts, productDetails, createProductController, updateProductController, deleteProductController } = require('../controllers/product.controller');
const { authorize } = require('../middleware/authorize');

publicRouter.get('/', listProducts);
publicRouter.get('/:id', productDetails);
protectedRouter.post('/', authorize('ADMIN', 'SUPPLIER'), createProductController);
protectedRouter.put('/:id', authorize('ADMIN', 'SUPPLIER'), updateProductController);
protectedRouter.delete('/:id', authorize('ADMIN'), deleteProductController);

module.exports = { publicRouter, protectedRouter };
