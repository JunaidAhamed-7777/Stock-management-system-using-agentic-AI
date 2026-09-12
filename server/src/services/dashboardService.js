const prisma = require('../prismaClient');

const getAdminMetrics = async () => {
  const [totalProducts, totalOrders, pendingOrders, lowStockProducts, totalCustomers, totalSuppliers] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.product.count({ where: { quantity: { lte: 10 } } }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.supplier.count(),
  ]);
  const stockAgg = await prisma.product.aggregate({ _sum: { quantity: true } });
  const totalStock = stockAgg._sum.quantity ?? 0;
  return { totalProducts, totalStock, totalOrders, pendingOrders, lowStockProducts, totalCustomers, totalSuppliers };
};

const getSupplierMetrics = async (supplierId) => {
  const products = await prisma.product.findMany({ where: { supplierId } });
  const productCount = products.length;
  const stock = products.reduce((sum, p) => sum + p.quantity, 0);
  const lowStock = products.filter((p) => p.quantity <= p.lowStockThreshold).length;
  return { productCount, stock, lowStock };
};

const getCustomerMetrics = async (customerId) => {
  const [orderCount, pendingOrders, deliveredOrders, totalSpending] = await Promise.all([
    prisma.order.count({ where: { customerId } }),
    prisma.order.count({ where: { customerId, status: 'PENDING' } }),
    prisma.order.count({ where: { customerId, status: 'DELIVERED' } }),
    prisma.order.aggregate({ where: { customerId }, _sum: { totalAmount: true } }),
  ]);
  return { orderCount, pendingOrders, deliveredOrders, totalSpending: totalSpending._sum.totalAmount ?? 0 };
};

module.exports = { getAdminMetrics, getSupplierMetrics, getCustomerMetrics };
