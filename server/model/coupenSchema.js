const mongoose = require('mongoose');

const coupenSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    index:true
  },
  isPercentage:{
    type:Boolean,
    default:true
  },
  maxDiscount:{
    type:Number,
    default:null
  },
  discount: {
    type: Number,
    required: true
  },
  expiry: {
    type: Date,
    default: null
  },
  active: {
    type: Boolean,
    default: true
  },
  minAmount: {
    type: Number,
    default: 0
  },
  limit: {
    type: Number,
    default: 1
  }
}, { timestamps: true });


const Coupen = mongoose.model('Coupen',coupenSchema);
module.exports = Coupen;
