const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middleware/auth");
const { validate } = require("../models/user");
const { validateEditProfileData } = require("../utlis/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    
    res.send( user );
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid fields in request body");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach(
      (field) => (loggedInUser[field] = req.body[field]),
    );

    loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName} Profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

profileRouter.patch("/profile/updatePassword", userAuth, async (req, res) => {
  try {
    if (!validateUserPasswordUpdate(req)) {
      throw new Error("Invalid password format");
    }
    const { newPassword } = req.body;
    const loggedInUser = req.user;
    loggedInUser.password = newPassword;
    await loggedInUser.save();
    res.json({
      message: "Password updated successfully",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = profileRouter;
