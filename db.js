const mongoose = require("mongoose");
require("dotenv").config()


const connectDB = async () => {
  try {
   
    await mongoose.connect( process.env.DATABASE_URL)
    console.log("Connected Successfully!");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
// export default connectDB;
