const { getAdminMetrics, getSupplierMetrics, getCustomerMetrics } = require('../services/dashboardService');

const dashboardController = async (req, res, next) => {
  try {
    let data;
    switch (req.user.role) {
      case 'ADMIN':
        data = await getAdminMetrics();
        break;
      case 'SUPPLIER':
        data = await getSupplierMetrics(req.user.supplierId);
        break;
      case 'CUSTOMER':
        data = await getCustomerMetrics(req.user.id);
        break;
      default:
        return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    res.json({ success: true, role: req.user.role, metrics: data });
  } catch (err) {
    next(err);
  }
};

module.exports = { dashboardController };
