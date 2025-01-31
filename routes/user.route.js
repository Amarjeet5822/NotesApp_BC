const express = require("express");
const { UserModel } = require("../models/user.models");
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
        res.status(400).json({ err });
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
  // logic to trim pass and email
  try {
    const matchingUser = await UserModel.findOne({ email });
    if (matchingUser) {
      const isPasswordMatching = await bcrypt.compare(pass, matchingUser.pass);
      if (isPasswordMatching) {
        const token = jwt.sign(
          { userId: matchingUser._id, user: matchingUser.name },
          process.env.SECRET_KEY
        );
        res.status(200).json({ msg: "Login Successfull!", token });
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
// Get all the user's
userRouter.get("/",auth, async (req, res) => {
  const users = await UserModel.find()
  if (!users) {
    return res.status(400).json({ message: "NO USER FOUND!" });
  }
  res.send(users);
});

module.exports = { userRouter };
