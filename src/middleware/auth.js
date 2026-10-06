const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Unauthorized");
        }
        const decoded = await jwt.verify(token, "DevT!inder");
        const {userId} = decoded;
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next();

    }catch{
        res.status(401).json({ message: "Unauthorized" });
    }
}

module.exports = userAuth;