const logger = require("../config/logger");

// Log errors and send a generic response
exports.errorHandler = (err, req, res, next) => {
  logger.error(err.stack);
  
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: "Unauthorized access." });
  }

  // Default error response
  res.status(500).json({ error: "Something went wrong!" });
};
