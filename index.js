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
  origin: (origin, callback) => {
    const allowedOrigins = [process.env.FE_URL, process.env.DEPLOY_FE_URL];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow requests from valid origins or Postman (no origin)
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "HEAD", "PATCH", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));

app.use(router);

swaggerDocs(app); // Load Swagger for Documentation


const PORT = process.env.PORT;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running at http://localhost:${PORT}`);
});
