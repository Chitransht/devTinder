const validator = require("validator");

const signupValidation = (req) => {
  const { firstName, lastName, emailId, password, age, gender } = req.body;

  if (!firstName || !lastName) {
    throw new Error("First name and last name are required");
  } else if (!emailId || !validator.isEmail(emailId)) {
    throw new Error("Invalid email address");
  } else if (
    !password ||
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    throw new Error(
      "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol",
    );
  }
  
};

module.exports = signupValidation;