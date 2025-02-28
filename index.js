const express = require("express");
const { connectDB } = require("./dbConnection");
const swaggerDocs = require("./swaggerConfig"); // import swaggerDocs
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

const whitelist = [process.env.FE_URL, process.env.DEPLOY_FE_URL];

const corsOptionsDelegate = (req, callback) => {
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    callback(null, {
      origin: req.header("Origin"), //// Automatically reflects the request's origin if in the whitelist
      credentials: true,
      methods: "GET,HEAD,PATCH,POST,PUT,DELETE",
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    }); // reflect (enable) the requested origin in the CORS response
  } else {
    callback(null, {origin: false}); // Deny CORS if not in whitelist
  }
};
app.use(cors(corsOptionsDelegate));

app.use(router);

swaggerDocs(app); // Load Swagger for Documentation

const PORT = process.env.PORT;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running at http://localhost:${PORT}`);
});
