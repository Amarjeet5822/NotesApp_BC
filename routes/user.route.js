require("dotenv").config();
const express = require("express");
const { UserModel } = require("../models/user.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { registerMiddleware } = require("../middlewares/registrationLogic");
const { loginMiddleware } = require("../middlewares/loginMiddleware");
const { auth } = require("../middlewares/authMw");
const { TokenModel } = require("../models/token.models");

const userRouter = express.Router();

// User Registration
userRouter.post("/register", registerMiddleware, async (req, res) => {
  const { name, pass, email } = req.body;
  
  try {
    bcrypt.hash(pass, Number(process.env.SALT_ROUNDS), async (err, hash) => {
      if (err) {
        res.status(400).json({ msg: err.message }); // ! update  for more specific error
      } else {
        const newUser = new UserModel({ name, email, pass: hash });
        await newUser.save();
        res.status(200).json({ msg: "You have been successfully regitered!" });
      }
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
          httpOnly: true,
          secure: true, // Set true in production
          sameSite: "Strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
        res.status(200).json({ msg: "Login Successfull!",refreshToken });
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
    if(!refreshToken) {
      return res.status(400).json({ msg: "No token provided"})
    }
    const newToken =  new TokenModel({ token: refreshToken, userId });
    await newToken.save();

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,  // Set true in production
      sameSite: "Strict",
    });
    res.status(200).json({message: "logout Successful!"})
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})
module.exports = { userRouter };
