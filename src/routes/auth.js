const express = require('express');
const authRouter = express.Router();
const signupValidation = require('../utlis/validation');
const bcrypt = require('bcrypt');
const User = require('../models/user');

authRouter.post("/signup", async (req, res) => {
  try {
    signupValidation(req);

    const { firstName, lastName, emailId, password } = req.body;
    //Encrypt the password before saving to the database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    req.body.password = hashedPassword;

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: "User created successfully",
    });
  } catch (err) {
    console.error("ERROR:", err);

    res.status(500).json({
      message: "Signup failed",
      error: err.message,
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = await user.getJWT();

    res.cookie("token", token);
    res.send({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: "Error during login" });
  }
});

authRouter.post("/logout", (req, res) => {
  try {
    res.clearCookie("token");
    res.send({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ message: "Error during logout" });
  } 
});

module.exports = authRouter;