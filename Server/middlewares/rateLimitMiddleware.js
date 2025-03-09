const rateLimit = require("express-rate-limit");

// Limit login attempts to 5 per 15 minutes
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many login attempts. Please try again later.",
      retryAfter: 15 * 60 // 15 minutes in seconds
    });
  }
});

// Limit API requests to 100 per 15 minutes
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests. Please try again later.",
});
