const express = require("express");
const { userRouter } = require("./user.route");
const { noteRouter } = require("./note.route");
const { featuresRouter } = require("./feature.route");
const tokenRouter = require("./token.route");

const router = express.Router();

router.use("/users", userRouter);
router.use("/notes", noteRouter);
router.use("/api", featuresRouter);
router.use("/token", tokenRouter);

module.exports = router;