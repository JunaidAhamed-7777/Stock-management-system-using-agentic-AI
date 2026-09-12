const express = require('express');
const router = express.Router();
const { forecastController, stockoutController, recommendationsController } = require('../controllers/ai.controller');

router.get('/forecast', forecastController);
router.get('/stockout', stockoutController);
router.get('/recommendations', recommendationsController);

module.exports = router;
