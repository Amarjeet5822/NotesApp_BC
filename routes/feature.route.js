const express = require("express");
const { auth } = require("../middlewares/authMw");

const featuresRouter = express.Router();

// Search Notes 
featuresRouter.get("/search",auth, (req, res) => {
  
});


module.exports = { featuresRouter };