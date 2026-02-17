const { body } = require("express-validator");

const validateUser = [
  body("email")
    .isEmail()
    .withMessage("Valid email required"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Minimum length 8")
];

module.exports = validateUser;
