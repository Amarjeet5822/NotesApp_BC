require("dotenv").config();
const express = require("express");
const { connectDB } = require("./dbConnection");
const { noteRouter } = require("./routes/note.route");
const { userRouter } = require("./routes/user.route");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());


app.use("/users", userRouter);
app.use("/notes", noteRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running at http://localhost:${PORT}`);
});
