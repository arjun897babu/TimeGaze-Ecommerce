const mongoose = require('mongoose');

databaseURI = process.env.MONGO_URI;

const connectDB = async () =>{
  try{
    const con  = await mongoose.connect(databaseURI);
    console.log(`MongoDB is connected : ${con.connection.host}`);
  }
  catch(error){
    console.log(`MongoDB connection is failed with:${error.message}`)
  }
}

module.exports = connectDB;