
const mongoose = require('mongoose');
const mailSender = require('../services/mailSender');



const otpSchema = new mongoose.Schema({
  email: {
    type: String,

  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date, 
    default: Date.now,
    expires: 60 * 2
  }

}); 





const OTPVerfication = mongoose.model('OTP', otpSchema);
module.exports = OTPVerfication