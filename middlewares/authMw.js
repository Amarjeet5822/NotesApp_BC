const jwt = require("jsonwebtoken");
const { TokenModel } = require("../models/token.models");
require("dotenv").config();

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    const isTokenInDb = await TokenModel.findOne(token);
    if(isTokenInDb) {
      return res.status(440).json({ msg: "Session is Expired! Login first" });
    }
    if (!token) {
      return res.status(400).json({ msg: "Please login first!" });
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if(err) {
        return res.status(400).json({ msg: "Please login first!", err });
      }
      req.user = decoded // { userId: user_id, name: user.name} = payload
      next();
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};
module.exports = { auth };
