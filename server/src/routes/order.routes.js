const express = require('express');
const router = express.Router();
const { listOrders, listAllOrders, orderDetails, createOrderController, updateStatusController } = require('../controllers/order.controller');
const { authorize } = require('../middleware/authorize');

router.get('/', (req, res, next) => {
  if (req.user.role === 'ADMIN') {
    return listAllOrders(req, res, next);
  }
  listOrders(req, res, next);
});

router.get('/:id', orderDetails);
router.post('/', createOrderController);
router.patch('/:id/status', authorize('ADMIN', 'SUPPLIER'), updateStatusController);

module.exports = router;
