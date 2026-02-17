const { body } = require("express-validator");

const validateUser = [
  body("url")
    .isURL()
    .withMessage("Valid url required"),

  body("email")
    .isEmail()
    .withMessage("Valid email required")
];

module.exports = validateUser;
