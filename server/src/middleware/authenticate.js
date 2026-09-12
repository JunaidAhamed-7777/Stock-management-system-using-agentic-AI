const { verifyToken } = require('../utils/jwt');
const prisma = require('../prismaClient');
// validator unused

const authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Missing Authorization header' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Invalid Authorization header format' });
  }
  try {
    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
req.user = { id: user.id, role: user.role };
  if (user.role === 'SUPPLIER') {
    const supplier = await prisma.supplier.findUnique({ where: { userId: user.id } });
    if (supplier) req.user.supplierId = supplier.id;
  }
  next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = { authenticate };
