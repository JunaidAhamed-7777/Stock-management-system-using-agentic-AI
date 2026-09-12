const { register, login, getMe } = require('../services/authService');

const registerController = async (req, res, next) => {
  try {
    const { name, email, password, role = 'CUSTOMER' } = req.body;
    const user = await register({ name, email, password, role });
    res.status(201).json({ success: true, data: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
};

const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await login({ email, password });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const meController = async (req, res, next) => {
  try {
    const user = await getMe(req.user.id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

module.exports = { registerController, loginController, meController };
