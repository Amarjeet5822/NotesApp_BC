const express = require("express");
const { connectDB } = require("./dbConnection");
const { noteRouter } = require("./routes/note.route");
const { userRouter } = require("./routes/user.route");
const { featuresRouter } = require("./routes/feature.route");
const tokenRouter = require("./routes/token.route");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json()); // req.body parse json
app.use(express.urlencoded({ extended: false }));

// Define the secret key for signing cookies
const cookieParserSecret = process.env.SECRET_KEY;
app.use(cookieParser(cookieParserSecret));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true, // 
  methods: "GET,PATCH,POST,DELETE",
  allowedHeaders:["Content-Type", "Authorization"],

}));


app.use("/users", userRouter);
app.use("/notes", noteRouter);
app.use("/api", featuresRouter);
app.use("/token", tokenRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running at http://localhost:${PORT}`);
});
