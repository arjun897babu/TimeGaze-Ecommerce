const mongoose = require('mongoose');
const Wallet = require('../model/walletSchema');

exports.userWallet = async (userId) => {
  try {
   

    return await Wallet.aggregate(
      [
        {
          $match:
            { userId: new mongoose.Types.ObjectId(userId) }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'users'
          }
        },
        {
          $project: {
            userId: 0,
            'users._id': 0
          }
        }
      ]);
     
  }
  catch (error) {
   throw error
  }
}