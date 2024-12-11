const Product = require('../model/productSchema');
const Wallet = require('../model/walletSchema');
const { generateUUID } = require('./random-id-generator');

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
};

exports.newProducts = async()=>{
  try{
    return Product.aggregate(
      [
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category',
          },
        },
        { $unwind: '$category' },
        { $match: {} },
        { $sort: { _id: -1 } },
        {$limit:10}
    
      ]
    )
  }
  catch(error){
   throw error
  }
}

