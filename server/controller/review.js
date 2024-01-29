const mongoose = require('mongoose')
const Product = require('../model/productSchema');
const Review = require('../model/reviewSchema');
//create a middle ware for cheking user is logged and purchased the specific product,product Id is valid,product is not unlisted
exports.addReview = async (req, res, next) => {
  try {
    const { userId } = req.session
    const { rating, reviewText } = req.body;
    const { productId } = req.params;

    if (!userId) return res.status(400).json(
      {
        status: 'error',
        message: 'Only purchased user can write the review'
      }
    )

    if (!rating || rating < 1) return res.status(400).json(
      {

        status: 'error',
        message: 'Please provide a rating'

      }
    )
    if (!reviewText || rating === '') return res.status(400).json(
      {
        status: 'error',
        message: 'Write about the product'
      }
    );

    const existingReview = await Review.exists(
      {
        product: productId,
        review: {
          $elemMatch: {
            userId: userId
          }
        }
      }
    );
    let message;
    
    if (existingReview) {
      await Review.updateOne(
        {
          product: productId,
          review: {
            $elemMatch: {
              userId: userId
            }
          }
        },
        {
          $set: {
            'review.$.reviewText': reviewText,
            'review.$.rating': rating
          }
        }
      );
      message = 'Review updated'
    } else {
      await Review.updateOne(
        { product: productId },
        {
          $push: {
            review:
            {
              userId: userId,
              reviewText: reviewText,
              rating: rating
            }
          }
        },

        { upsert: true }
      );
      message = 'Review Added'
    }

    return res.json(
      {
        status: 'success',
        message: message
      }
    )
  }
  catch (error) {
    console.error(error)
    next(error)
  }
} 