const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(400).json({ msg: "Please login first!" });
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (decoded) {
        req.user = decoded
        next();
      }else{
        return res.status(400).json({ msg: "Please login first!", err });
      }
      
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};
module.exports = { auth };
