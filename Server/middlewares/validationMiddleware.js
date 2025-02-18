const { body, validationResult } = require("express-validator");

// Validate user signup request
exports.validateSignup = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .isIn(["student", "admin", "college_admin"])
    .withMessage("Invalid role"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];


// Validate course creation request
exports.validateCourse = [
  body("title").notEmpty().withMessage("Title is required"),
  body("fees").isNumeric().withMessage("Fees must be a number"),
  body("duration").notEmpty().withMessage("Duration is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];