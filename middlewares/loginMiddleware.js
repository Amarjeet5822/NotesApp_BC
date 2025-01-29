const { UserModel } = require("../models/user.models");

const comparePass = async (user, pass) => {
  try {
    const isPasswordMatching = await bcrypt.compare(pass, user.pass)
  return isPasswordMatching
  } catch (error) {
    return false
  }
}

const loginMiddleware = async (req, res, next) => {
  const {email, pass} = req.body;
  // logic to trim pass and email 
  if(!email || !pass){
    return res.status(400).json({msg:"Required email and password"})
  }
  if(!/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(email)){
    return res.status(400).json({msg:"Invalid email! Please enter correct valid email"})
  }
  const user =await UserModel.findOne({email});
  if(!user){
    return res.status(404).json({message:"User not Found! Please register First"})
  }
  if (comparePass(user, pass)){
    next();
  }else{ 
    return res.status(400).json({message:"Invalid credential!"})
  }

};

module.exports = {loginMiddleware};