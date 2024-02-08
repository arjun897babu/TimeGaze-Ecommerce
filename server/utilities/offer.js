const mongoose = require('mongoose');
const Offer = require('../model/offerSchema');
const Cart = require('../model/cartSchema');

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

exports.calulateLastPrice = async (userId)=>{
  try{
    const productoffer = await Cart.aggregate(
      [
        {
          $match:
          {
            userId: new mongoose.Types.ObjectId(userId) ,
          }
        },
        {
          $unwind: '$cartItem'
        },
        {
          $lookup: {
            from: 'products',
            localField: 'cartItem.product',
            foreignField: '_id',
            as: 'products'
          }
        },
        {
          $unwind: '$products'
        },
        {
          $project: {
            _id: 0,
            productQuantity: '$cartItem.quantity',
            productofferDetails: '$products.productOffer',
            categoryOfferDetails: '$products.categoryOffer',
            productPrice: '$products.discountPrice'
          }
        }
  
  
      ]
    )
  
    const currentTime = Date.now();
  
    let lastPrice = productoffer.reduce((total, item) => {
      const { productQuantity, productPrice } = item;
      const productOffer = item.productofferDetails?.discount || 0;
      const categoryOffer = item.categoryOfferDetails?.discount || 0;
      const productOfferExpired = new Date(item.productofferDetails?.expiry).getTime() < currentTime;
      const categoryOfferExpired = new Date(item.categoryOfferDetails?.expiry).getTime() < currentTime;
  
      let discountedPrice = productPrice;
  
      if (!productOfferExpired && productOffer) {
        discountedPrice *= (1 - productOffer / 100);
      }
      if (!categoryOfferExpired && categoryOffer) {
        discountedPrice *= (1 - categoryOffer / 100);
      }
  
      return (total + (discountedPrice * productQuantity));
    }, 0);

    return Math.round(lastPrice);

  }catch(error){
    throw error
  }
}