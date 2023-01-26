const express = require("express");
const connectDB = require("./database/conn");
const dotenv = require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT || 5000;

const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.use("/api", require('./routes/auth'));
app.use("/api", require('./routes/post'));



app.listen(PORT, () => {
  console.log("listening on port", PORT);
});
