const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGOURI);

  console.log("MongoDB database connection established successfully");
};

module.exports = connectDB;
