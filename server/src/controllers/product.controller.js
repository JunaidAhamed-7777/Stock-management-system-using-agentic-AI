const { getAll, getById, createProduct, updateProduct, deleteProduct } = require('../services/productService');
const { authorize } = require('../middleware/authorize');

const listProducts = async (req, res, next) => {
  try {
    const filters = {
      search: req.query.search,
      categoryId: req.query.category,
      supplierId: req.query.supplier,
      lowStock: req.query.lowStock === 'true',
      lowStockThreshold: req.query.lowStockThreshold ? Number(req.query.lowStockThreshold) : undefined,
    };
    const products = await getAll(filters);
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

const productDetails = async (req, res, next) => {
  try {
    const product = await getById(Number(req.params.id));
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

const createProductController = async (req, res, next) => {
  try {
    const supplierId = req.user.role === 'SUPPLIER' ? req.user.supplierId : req.body.supplierId;
const product = await createProduct({ ...req.body, supplierId });
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

const updateProductController = async (req, res, next) => {
  try {
    const product = await updateProduct(Number(req.params.id), req.body, req.user);
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

const deleteProductController = async (req, res, next) => {
  try {
    await deleteProduct(Number(req.params.id), req.user);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listProducts,
  productDetails,
  createProductController,
  updateProductController,
  deleteProductController,
};
