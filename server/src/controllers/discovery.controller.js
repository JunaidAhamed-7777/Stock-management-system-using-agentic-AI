const { getCategories, getSuppliers, getSupplierById } = require('../services/discoveryService');

const categoriesController = async (req, res, next) => {
  try {
    const cats = await getCategories();
    res.json({ success: true, data: cats });
  } catch (err) {
    next(err);
  }
};

const suppliersController = async (req, res, next) => {
  try {
    const suppliers = await getSuppliers();
    res.json({ success: true, data: suppliers });
  } catch (err) {
    next(err);
  }
};

const supplierDetailController = async (req, res, next) => {
  try {
    const supplier = await getSupplierById(Number(req.params.id));
    res.json({ success: true, data: supplier });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  categoriesController,
  suppliersController,
  supplierDetailController,
};
