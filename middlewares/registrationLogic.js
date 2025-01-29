const { UserModel } = require("../models/user.models");


const registerMiddleware = async (req, res, next) => {
  const {email} = req.body;
  if(!email){
    return res.status(400).json({message:"Invalid email ID!"})
  }
  const user =await UserModel.findOne({email});
  if(user){
    return res.status(406).json({message:"User already exit! Please login"})
  } else{
    next();
  }
};

module.exports = {registerMiddleware};
 