const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const signupValidation = require("./utlis/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();
const userAuth = require("./middleware/auth");
const cors = require("cors");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const connectRequestRouter = require("./routes/connectRequest");
const userRouter = require("./routes/user");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectRequestRouter);
app.use("/", userRouter);

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
