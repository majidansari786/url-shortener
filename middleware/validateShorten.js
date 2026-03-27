const { body } = require("express-validator");

const validateUser = [
  body("url").isURL().withMessage("Valid url required")
];

module.exports = validateUser;
