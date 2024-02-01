const mongoose = require('mongoose');
const Address = require('../model/addressSchema');

exports.userAddress = async (addressId) => {


  try {
    return await Address.aggregate(
      [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(addressId)
          }
        },
        { $unwind: '$address' }
      ]
    )

  }
  catch (error) {
     throw error
  }
}