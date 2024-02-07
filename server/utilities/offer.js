const mongoose = require('mongoose');
const Offer = require('../model/offerSchema')

exports.allOffer = async () => {
  return await Offer.aggregate(
    [
      {
        $match: {}
      },
      {
        $lookup: {
          from: "products",
          localField: "item",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "item",
          foreignField: "_id",
          as: "categoryDetails"
        }
      },
      {
        $unwind: {
          path: '$productDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$categoryDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          offerType: 1,
          item: 1,
          discount: 1,
          expiry: 1,
          'productDetails.productName': 1,
          'categoryDetails.categoryName': 1,
        }
      }

    ]
  )
}