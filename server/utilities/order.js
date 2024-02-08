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
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId)
        }
      },
      { $unwind: '$orderItems' },
      {
        $match: {
          'orderItems.product': new mongoose.Types.ObjectId(productId),
          'orderItems.orderStatus': 'delivered'
        }
      }
    ]
    );

    return isPurchased ? true : false;
  } catch (error) {
    throw error
  }
}

exports.topSellingProducts = async () => {
  try {
    return await Order.aggregate(
      [
        { $unwind: '$orderItems' }, 

       
        {
          $lookup: {
            from: "products", 
            localField: "orderItems.product",
            foreignField: "_id",
            as: "productDetails"
          }
        },
        
        { $unwind: "$productDetails" }, 
        {
          $group: {
            _id: "$orderItems.product",
            totalQuantitySold: { $sum: "$orderItems.quantity" },
            productDetails: { $first: "$productDetails" } 
          }
        },
  
        {
          $sort: { totalQuantitySold: -1 }
        },
  
       
        {
          $project: {
            _id: 0,
            totalQuantitySold: 1,
            productDetails: 1
          }
        }
      ]
    )
  }
  catch (error) {
    throw error
  }
}

exports.getSingleOrder = async (soid)=>{
  try{
    const singleOrder = await Order.aggregate([
      {$unwind:'$orderItems'},
      {
        $match: {
          'orderItems._id': new mongoose.Types.ObjectId(soid) 
          }
        
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $project: {
          userId: 0,
          'user._id': 0,
          'user.password': 0,
          'user.isBlocked': 0,
          'user.isVerified': 0,
          'user.__v': 0,
          'user.adress': 0,
        }
      }
    ]);

    return singleOrder
  }catch(error){
    throw error
  }
}