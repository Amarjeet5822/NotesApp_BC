const express = require("express");
const { connectDB } = require("./dbConnection");
const swaggerDocs = require("./swaggerConfig") // import swaggerDocs
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./routes/index.route");

const app = express();

app.use(express.json()); // req.body parse json
app.use(express.urlencoded({ extended: false }));

// Define the secret key for signing cookies
const cookieParserSecret = process.env.SECRET_KEY;
app.use(cookieParser(cookieParserSecret));

app.use(cors({
  origin: [process.env.FE_URL],
  credentials: true, // 
  methods: ["GET" ,"PATCH","POST", "DELETE"],
  allowedHeaders:["Content-Type", "Authorization"],

}));

app.use(router);

swaggerDocs(app); // Load Swagger for Documentation

const PORT = process.env.PORT;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running at http://localhost:${PORT}`);
});
