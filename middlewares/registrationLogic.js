const { UserModel } = require("../models/user.models");

const registerMiddleware = async (req, res, next) => {
  const { email, name, pass } = req.body;
  try {
    if (!email || !name || !pass) {
      return res.status(406).json({ message: "resource is unavailable!" });
    }
    const user = await UserModel.findOne({ email });
    if (user) {
      return res
        .status(409)
        .json({ message: "User already exist! Please login" });
    } 
    else {
      next();
    }
  } catch (error) {
    return res.status(500).json({message:"internal Server error", error: error.message });
  }
};

module.exports = { registerMiddleware };
