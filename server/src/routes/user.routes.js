const express = require('express');
const router = express.Router();
const { getProfileController, updateProfileController } = require('../controllers/user.controller');

router.get('/me', getProfileController);
router.patch('/me', updateProfileController);

module.exports = router;
