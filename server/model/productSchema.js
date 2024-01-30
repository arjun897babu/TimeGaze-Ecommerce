const mongoose = require('mongoose');
const { schema } = require('./userModelSchema');


const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true,
  },
  caseDiameter: {
    type: Number,
    required: true,
  },
  caseShape: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  offer: {
    type: Number,
    required: true,
  },
  discountPrice: {
    type: Number,

  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref:'category',
    required: true,
    
  },
  quantity: {
    type: Number,
    required: true
  },
  image: [{
    type: String,
  }],
  unlisted:{
    type:Boolean,
    default:false
  },
  specialOffer:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Offer'
  }

})


const Product = mongoose.model('Product', productSchema);
module.exports = Product;
