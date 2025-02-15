const express = require('express');
const { auth } = require('../middlewares/authMw');

const tokenRouter = express.Router();

tokenRouter.get("/" , auth,async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if(!token) {
      return res.status(404).json({msg: "token not found"})
    }
    res.status(200).json(token)
  } catch (error) {
    res.status(500).json({msg: "Internal server Error" , error})
  }
})

module.exports = tokenRouter;