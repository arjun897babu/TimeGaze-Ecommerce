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
  }
  
})

const category = mongoose.model('category', categorySchema);
module.exports = category;