const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  token: {type: String, required: true },
  userId: { type: String, required: true },
  expireAt: {type: Date, required: true, default: Date.now, expires: "7d" }
})

const TokenModel = mongoose.model("tokens", tokenSchema);

module.exports = { TokenModel};