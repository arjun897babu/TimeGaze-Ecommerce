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