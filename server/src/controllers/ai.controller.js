const forecastController = (req, res) => {
  res.status(501).json({ success: false, code: 'AI_NOT_IMPLEMENTED', message: 'AI workflow integration is not enabled yet.' });
};

const stockoutController = (req, res) => {
  res.status(501).json({ success: false, code: 'AI_NOT_IMPLEMENTED', message: 'AI workflow integration is not enabled yet.' });
};

const recommendationsController = (req, res) => {
  res.status(501).json({ success: false, code: 'AI_NOT_IMPLEMENTED', message: 'AI workflow integration is not enabled yet.' });
};

module.exports = {
  forecastController,
  stockoutController,
  recommendationsController,
};
