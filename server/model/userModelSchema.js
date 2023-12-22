const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true,
    unique: true,
    trim: true
  },
  phonenumber: {
    type: Number,
    require: true,
    unique:true
  },
  password: {
    type: String,
    require: true,

  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  isVerified:{
    type:Boolean,
    default:false
  },
  adress:{
    type:mongoose.Schema.ObjectId,
    ref:'adress',
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;