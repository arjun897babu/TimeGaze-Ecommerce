const mongoose = require('mongoose')
const Order = require('../model/orderSchema');

exports.profitAndOrder = async function () {
  return Order.aggregate([
    { $unwind: '$orderItems' },
    {
      $match: {
        'orderItems.orderStatus': 'delivered'
      }
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalAmount: { $sum: '$total' }
      }
    }
  ])
}

exports.userPurchased = async (userId, productId) => {
  try {
   
    const [isPurchased] = await Order.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } }, { $unwind: '$orderItems' }, { $match: { 'orderItems.product': new mongoose.Types.ObjectId(productId),'orderItems.orderStatus':'delivered' } }]);
    console.log('ispr', isPurchased);
    return isPurchased ? true : false;
  } catch (error) {

  }
}