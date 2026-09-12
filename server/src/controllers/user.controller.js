const { getProfileById, updateProfile } = require('../services/userService');

const getProfileController = async (req, res, next) => {
  try {
    const user = await getProfileById(req.user.id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const updateProfileController = async (req, res, next) => {
  try {
    const data = { name: req.body.name, email: req.body.email };
    const user = await updateProfile(req.user.id, data);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfileController, updateProfileController };
