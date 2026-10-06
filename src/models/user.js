const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if(!validator.isEmail(value)){
          throw new Error("Invalid email address");
        }
      }
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if(!validator.isStrongPassword(value, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
          throw new Error("Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol");
        }
      }
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["Male", "Female", "Other"].includes(value)) {
          throw new Error("Gender must be Male, Female, or Other");
        }
      },
    },
    photoUrl: {
      type: String,
      validate(value) {
        if(!validator.isURL(value)){
          throw new Error("Invalid photo URL");
        }
      }
    },
    about: {
      type: String,
    },
    skills: {
      type: [String],
      maxlength: 10,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT =async function(){
  const user = this;
  const token = await jwt.sign({ userId: user._id }, "DevT!inder", {
    expiresIn: "1h",
  });
  return token;
}

const User = mongoose.model("User", userSchema);
module.exports = User;
