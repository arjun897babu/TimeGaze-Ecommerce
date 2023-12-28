const mongoose =  require('mongoose');

const cartSchema = new mongoose.Schema({
  userId:{
    type:mongoose.Schema.ObjectId,
    ref:'User'
  },
  cartItem:[{
    product:{
      type:mongoose.Schema.ObjectId,
      ref:'Product'
    },
    quantity:{
      type:Number,
      default:1,
      
    }
  }],
  cartTotal:{
    type:Number,
  }
})

const Cart = mongoose.model('Cart',cartSchema);
module.exports = Cart