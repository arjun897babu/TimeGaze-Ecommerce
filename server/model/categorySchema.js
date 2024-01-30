const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryName:{
    type:String,
    require:true,
    unique:true
  },
  unlisted:{
    type:Boolean,
    default:false,
  },
  specialOffer: {
    discount: Number,
    expiry: Date
  }
  
})

const category = mongoose.model('category', categorySchema);
module.exports = category;