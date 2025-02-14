const validator = require("validator");

const validateUserInput = (user) => {
  const errors = {};
  if (!validator.isEmail(user.email)) errors.email = "Invalid email";
  if (!validator.isStrongPassword(user.password)) errors.password = "Weak password";
  if (!user.fullName || user.fullName.length < 3) errors.fullName = "Full Name too short";
  return errors;
};

module.exports = validateUserInput;
