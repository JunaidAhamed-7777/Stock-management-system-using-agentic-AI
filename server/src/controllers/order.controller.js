const { createOrder, getOrdersByUser, getAllOrders, getOrderById, updateOrderStatus } = require('../services/orderService');

const listOrders = async (req, res, next) => {
  try {
    const orders = await getOrdersByUser(req.user.id);
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

const listAllOrders = async (req, res, next) => {
  try {
    const orders = await getAllOrders();
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

const orderDetails = async (req, res, next) => {
  try {
    const order = await getOrderById(Number(req.params.id), req.user);
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

const createOrderController = async (req, res, next) => {
  try {
    const order = await createOrder(req.user.id, req.body.items || []);
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

const updateStatusController = async (req, res, next) => {
  try {
    const order = await updateOrderStatus(Number(req.params.id), req.body.status, req.user);
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listOrders,
  listAllOrders,
  orderDetails,
  createOrderController,
  updateStatusController,
};
