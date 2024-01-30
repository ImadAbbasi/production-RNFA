const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `connected to DATABASE ${mongoose.connection.host}`.bgCyan.white
    );
  } catch (error) {
    console.log(process.env.MONGO_URL);
    console.log(`Error in connecting to DB ${error}`.bgRed.white);
  }
};

module.exports = connectDB;
