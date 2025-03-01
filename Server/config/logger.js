const winston = require("winston");
const path = require("path");

const logDirectory = path.join(__dirname, "..", "logs");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: path.join(logDirectory, "error.log"), level: "error" }),
    new winston.transports.File({ filename: path.join(logDirectory, "combined.log") })
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console({ format: winston.format.simple() }));
}

module.exports = logger;
