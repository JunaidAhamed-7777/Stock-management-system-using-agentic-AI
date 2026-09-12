const express = require('express');
const router = express.Router();
const { registerController, loginController, meController } = require('../controllers/auth.controller');

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/me', meController);

module.exports = router;
