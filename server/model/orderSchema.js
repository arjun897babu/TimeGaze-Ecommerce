const mongoose = require('mongoose');


const OrderSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',

  },
  orderId: {
    type: Number
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
    specialOffer: {
      type: Number
    },
    extraOffer: {
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
    reason: {
      type: String
    },

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
  },
  coupon: {
    type: String,
    default: null
  },
  discount: {
    type: Number,
  },
  total: {
    type: Number
  },
  shipping: {
    type: String,
    default: 'Free'
  }



});

OrderSchema.index({ 'orderItems._id': 1 });
const Order = mongoose.model('Order', OrderSchema);
module.exports = Order 