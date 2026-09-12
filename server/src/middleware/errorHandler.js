/*
  Centralized error handling middleware.
  Exports two functions: notFound and errorHandler.
*/

const notFound = (req, res, next) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
};

const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ success: false, message });
};

module.exports = { notFound, errorHandler };
