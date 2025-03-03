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
/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: User Registration
 *     tags: 
 *       - Users  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - name
 *               - email
 *               - pass
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Amar Gupta"
 *               email:
 *                 type: string
 *                 example: "amargupta@gmail.com"
 *               pass:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Error hashing password
 *       406:
 *         description: resource is unavailable!
 *       409:
 *         description: User already exist! Please Login
 *       500:
 *         description: Internal Server error
 */

// User Registration
userRouter.post("/register", registerMiddleware, async (req, res) => {
  const { name, pass, email } = req.body;
  try {
    // throw new Error("Error in try block");
    const hash = await bcrypt.hash(pass, Number(process.env.SALT_ROUNDS));
    const newUser = new UserModel({ name, email, pass: hash });
    await newUser.save();
    res.status(201).json({ message: "You have been successfully regitered!" });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User Login
 *     description: Login a user and returns a Jwt token.
 *     tags: 
 *       - Users
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - pass
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               pass:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login Successful 
 *       400:
 *         description: Invalid Credential
 *       401:
 *         description: Unauthorized (Please Login First)
 *       404:
 *         description: User not Found! Please register First
 *       440:
 *         description: Session is Expired! (Please Login First)
 *       500:
 *         description: Internal Server Error
 */
// user Login
userRouter.post("/login", loginMiddleware, async (req, res) => {
  const { email, pass } = req.body;
  try {
    const matchingUser = await UserModel.findOne({ email });
    const isPasswordMatching = await bcrypt.compare(pass, matchingUser.pass);
    if (isPasswordMatching) {
      const refreshToken = jwt.sign(
        { userId: matchingUser._id, user: matchingUser.name },
        process.env.SECRET_KEY, { expiresIn: "7d"}
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,  // Prevents XSS attacks
        secure: process.env.NODE_ENV === "production", // `false` in development, `true` in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax", // `Strict` can block requests in some cases, `Lax` is better for authentication
        maxAge: 7 * 24 * 60 * 60 * 1000, // Seven Days
      });
      res.status(200).json({ message: "Login Successfull!",refreshToken, matchingUser });
    } else {
        return res.status(400).json({ message: "Invalid Credential" });
      }
  } catch (error) {
    res.status(500).json({ message:"Internal Server Error", error });
  }
});
/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: User Logout
 *     description: Logs out the user by clearing the refresh token cookie.
 *     tags: 
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout Successful!"
 *       400:
 *         description: No token provided
 *       401:
 *         description: Unauthorized (Please Login First)
 *       440:
 *         description: Session is Expired! (Please Login First)
 *       500:
 *         description: Internal Server Error
*/
userRouter.post("/logout", auth, async (req, res) => {
  try {
    const { userId }  = req.user;
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) {
      return res.status(400).json({ message: "No token provided"})
    }
    const newToken =  new TokenModel({ token: refreshToken, userId });
    await newToken.save();
    
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // `false`
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax", // `Strict` can block requests in some cases, `Lax` is better for authentication
    });
    res.status(200).json({message: "logout Successful!"})
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get user details
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns user details
 *       401:
 *         description: Unauthorized (Please Login First)
 *       440:
 *         description: Session is Expired! (Please Login First)
 *       500:
 *         description: Internal Server Error
 */
userRouter.get("/", auth, async (req, res) => {
  try{
    const { userId} = req.user;
    const userDetail = await UserModel.findOne({ _id:userId });
    res.status(200).json(userDetail);
  }catch(error) {
    res.status(500).json({message:"Internal Server Error" ,error: error.message})
  }
});
/**
 * @swagger
 * /users:
 *   patch:
 *     summary: Update User
 *     tags: 
 *       - Users  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - name
 *               - email
 *               - pass
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Amar Gupta"
 *               email:
 *                 type: string
 *                 example: "amargupta@gmail.com"
 *               pass:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Updated successfully
 *       404:
 *         description: User not Found!
 *       406:
 *         description: resource is unavailable!
 *       440:
 *         description: Session is Expired! (Please login First)
 *       500:
 *         description: Internal Server error
 */

// User Update
userRouter.patch("/", auth, async (req, res) => {
  const { name, pass, email } = req.body;
 
  try {
    const oldUserDetail = await UserModel.findOne({email})
    if(!oldUserDetail) {
      return res.status(404).json({message: "User not Found!"})
    }
    // Use await instead of callback
    const hashedPassword = await bcrypt.hash(pass, Number(process.env.SALT_ROUNDS)); 
    await UserModel.findByIdAndUpdate({_id:oldUserDetail._id },{ name, email, pass: hashedPassword });
    res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
});
/**
 * @swagger
 * /users:
 *   delete:
 *     summary: To delete User
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: user Deleted Successfully
 *       401:
 *         description: Unauthorized (Please Login First)
 *       440:
 *         description: Session is Expired! (Please Login First)
 *       500:
 *         description: Internal Server Error
 */

userRouter.delete("/", auth, async (req, res) => {
  try{
    const { userId} = req.user;
    await UserModel.findByIdAndDelete({ _id: userId });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // `false`
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax", // `Strict` can block requests in some cases, `Lax` is better for authentication
    });
    res.status(200).json({message:"user deleted Successfully"});
  }catch(error) {
    res.status(500).json({message:"Internal Server Error" ,error: error.message})
  }
})

module.exports = { userRouter };
