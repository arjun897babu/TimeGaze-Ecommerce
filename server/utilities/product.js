const mongoose = require('mongoose');
const Product = require('../model/productSchema');
const category = require('../model/categorySchema');

exports.allProduct = async () => {
  return Product.aggregate([
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'category'
      }
    },
    {
      $match: {
        unlisted: false,
        'category.unlisted': false
      }
    },
    {
      $project: {
        productName: 1,
        _id: 1
      }
    }
  ])
}


exports.allSpecialOfferProducts = async () => {
  return await Product.aggregate(
    [
      { $match: { unlisted: false, 'specialOffer.expiry': { $exists: true, $gt: new Date() } }, },
      {
        $project: {
          _id: 0,
          type: 'Product',
          name: '$productName',
          expiry: '$specialOffer.expiry',
          discount: '$specialOffer.discount'
        }
      }
    ]
  )

}
