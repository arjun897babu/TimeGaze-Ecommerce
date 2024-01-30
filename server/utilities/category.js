const mongoose = require('mongoose');
const Category = require('../model/categorySchema');

exports.allCategory = async () => {
  return await Category.aggregate(
    [
      { $match: { unlisted: false } },
      {
        $project: {
          _id: 1,
          categoryName: 1
        }
      }
    ]
  )

}
exports.allSpecialOfferCategory = async () => {
  return await Category.aggregate(
    [
      {
        $match: {
          unlisted: false,
          'specialOffer.expiry': {
            $exists: true, $gt: new Date()
          }
        }
        
      },
      {
        $project: {
          _id: 0,
          type: 'Category',
          name: '$categoryName',
          expiry: '$specialOffer.expiry',
          discount: '$specialOffer.discount'
        }
      }
    ]
  )

}