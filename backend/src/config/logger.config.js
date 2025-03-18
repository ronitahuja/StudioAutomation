const winston = require("winston");
const { LOG_DB_URL } = require("../config/server.config");
require("winston-mongodb");
const BaseError = require("../errors/base.error");

const setUpLogger = () => {
  const transports = [
    new winston.transports.Console({   //logs to console
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(
          (log) =>
            `${log.timestamp} [${log.level.toUpperCase()}]: ${log.message}`
        )
      ),
    }),

    new winston.transports.File({ filename: "app.log" }),
  ];

  try {
    if (!LOG_DB_URL) {
      throw new BaseError(
        "You should provide a valid DB URL for logging.",
        500
      );
    }

    const mongoTransport = new winston.transports.MongoDB({
      level: "error",
      db: LOG_DB_URL,
      collection: "logs",
      options: { useUnifiedTopology: true },
    });

    // Listen for MongoDB transport errors
    mongoTransport.on("error", (error) => {
      console.error("MongoDB Logger Error:", error.message);
    });

    transports.push(mongoTransport);
  } catch (error) {
    console.error("Logger setup error:", error.message);
  }

  return winston.createLogger({   //creates winston logger instance
    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.printf(
        (log) => `${log.timestamp} [${log.level.toUpperCase()}]: ${log.message}`
      )
    ),
    transports,
  });
};

// Create the logger instance
const logger = setUpLogger();

// Middleware to attach logger to request
const loggerMiddleware = (req, res, next) => {
  req.logger = logger; // Attach logger instance to request
  next();
};

module.exports = { logger, loggerMiddleware };
