const express = require("express");
const { UserModel } = require("../models/user.models");
const { TokenModel } = require("../models/token.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { registerMiddleware } = require("../middlewares/registrationLogic");
const { loginMiddleware } = require("../middlewares/loginMiddleware");
const { auth } = require("../middlewares/authMw");
require("dotenv").config();

const userRouter = express.Router();

// User Registration
userRouter.post("/register", registerMiddleware, async (req, res) => {
  const { name, pass, email } = req.body;
 
  try {
    bcrypt.hash(pass, Number(process.env.SALT_ROUNDS), async (err, hash) => {
      if (err) {
        return res.status(400).json({ msg: err.message }); // ! update  for more specific error
      } 
      const newUser = new UserModel({ name, email, pass: hash });
      await newUser.save();
      res.status(200).json({ msg: "You have been successfully regitered!" });
      
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});
// user Login
userRouter.post("/login", loginMiddleware, async (req, res) => {
  const { email, pass } = req.body;
  try {
    const matchingUser = await UserModel.findOne({ email });
    if (matchingUser) {
      const isPasswordMatching = await bcrypt.compare(pass, matchingUser.pass);
      if (isPasswordMatching) {
        const refreshToken = jwt.sign(
          { userId: matchingUser._id, user: matchingUser.name },
          process.env.SECRET_KEY, { expiresIn: "7d"}
        );
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,  // Prevents XSS attacks
          secure: process.env.NODE_ENV === "production", // `false` in development, `true` in production
          sameSite:"none", // `Strict` can block requests in some cases, `Lax` is better for authentication
          maxAge: 90 * 60 * 60 * 1000, // Fifteen minutes
        });
        res.status(200).json({ msg: "Login Successfull!",refreshToken, matchingUser });
      } else {
        res.status(400).json({ msg: "Invalid Password" });
      }
    } else {
      res.status(404).json({ msg: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

userRouter.post("/logout", auth, async (req, res) => {
  try {
    const { userId }  = req.user;
    const refreshToken = req.cookies.refreshToken;
    console.log("line 65 logout = ", refreshToken)
    if(!refreshToken) {
      return res.status(400).json({ msg: "No token provided"})
    }
    const newToken =  new TokenModel({ token: refreshToken, userId });
    await newToken.save();

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,   // ✅ Change to false for localhost testing
      sameSite: "Lax", // ✅ Change to "Lax" for cross-site requests
    });
    res.status(200).json({message: "logout Successful!"})
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})
module.exports = { userRouter };
