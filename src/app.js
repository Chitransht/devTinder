const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const signupValidation = require("./utlis/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();
const userAuth = require("./middleware/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send({ user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

connectDB()
  .then(() => {
    console.log("MongoDB connected");

    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((err) => {
    console.error("Connection failed:", err);
  });
