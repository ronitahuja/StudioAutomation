const BaseError = require('../errors/base.error')

function errorHandler(err, req, res) {
  try {
    req.logger.error(`Something went wrong: ${err.message}`, {
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  } catch (loggingError) {
    console.error("Logging error:", loggingError);
  }

  if (!(err instanceof BaseError)) {
    err = new BaseError(err.message, 500);
  }

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    error: err.details || null,
    data: {},
  });
}

module.exports = errorHandler;
