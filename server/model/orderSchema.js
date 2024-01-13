const mongoose = require('mongoose');


const OrderSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',

  },
  orderItems: [{
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'Product'
    },
    productName: {
      type: String,

    },
    caseDiameter: {
      type: Number,
    },
    caseShape: {
      type: String
    },
    price: {
      type: Number
    },
    offer: {
      type: Number
    },
    discountPrice: {
      type: Number,
    },
    quantity: {
      type: Number,
    },
    productTotal: {
      type: Number,
    },
    image: [{
      type: String,
    }],
    orderStatus: {
      type: String,
      default: 'placed',
      index: true,
    },
    cancelReason:{
      type:String
    }

  }],
  address: {
    name: {
      type: String,

    },
    mobileNumber: {
      type: Number

    },
    district: {
      type: String,
    },
    pincode: {
      type: Number
    },
    locality: {
      type: String,
    },
    address: {
      type: String,
    },
    state: {
      type: String,
    },
    addressType: {
      type: String,
    }
  },
  paymentMethod: {
    type: String,

  },
  orderDate: {
    type: Date,
    default: Date.now()
  }

});

OrderSchema.index({ 'orderItems._id': 1 });
const Order = mongoose.model('Order', OrderSchema);
module.exports = Order 