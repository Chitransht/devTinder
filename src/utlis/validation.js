const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong Password!");
  }
}

const validateEditProfileData = (req) => {
  const editableFields = [
    "firstName",
    "lastName",
    "about",
    "age",
    "gender",
    "photoUrl",
  ];
  const isValid = Object.keys(req.body).every((field) =>
    editableFields.includes(field),
  );

  if (!isValid) {
    throw new Error("Invalid fields in request body");
  }
};

const validateUserPasswordUpdate = (req) => {
  const { newPassword } = req.body;
  if (!newPassword || !validator.isStrongPassword(newPassword)) {
    throw new Error(
      "New password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol",
    );
  }
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
  validateUserPasswordUpdate,
};
