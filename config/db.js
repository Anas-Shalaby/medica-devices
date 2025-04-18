const mongoose = require("mongoose");

const connectDB = async () => {
  const conn = await mongoose.connect(
    "mongodb+srv://anasyoussef649:Kw5kTWEK07IyuO13@cluster0.q8xiy.mongodb.net/e-commerce"
  );
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;
