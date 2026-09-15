const express = require('express');
const router = express.Router();
const { registerController, loginController, meController } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/authenticate');

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/me', authenticate, meController);

module.exports = router;
