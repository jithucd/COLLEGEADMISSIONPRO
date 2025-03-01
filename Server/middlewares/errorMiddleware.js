const logger = require("../config/logger");

exports.errorHandler = (err, req, res, next) => {
  console.error("Error: ", err.stack);
  logger.error(err.stack); 

  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: "Unauthorized access." });
  }

  res.status(500).json({ error: "Something went wrong!" });
};
