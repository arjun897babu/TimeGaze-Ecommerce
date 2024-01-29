const mongoose = require('mongoose');
const Review = require('../model/reviewSchema');

exports.productReview = async (userId, productId) => {

  const [review] = await Review.aggregate(
    [
      { $unwind: '$review' },
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      {$sort:{'review._id':-1}},
      {
        $lookup: {
          from: 'users',
          localField: 'review.userId',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: '$userInfo' },
      {
        $group: {
          _id: null,
          reviews: {
            $push: {
              username: '$userInfo.name',
              userId:'$userInfo._id',
              reviewText: '$review.reviewText',
              rating: '$review.rating',
              _id: '$review._id'
            }
          },
          averageReview: { $avg: '$review.rating' },
          oneStar: { $sum: { $cond: [{ $eq: ['$review.rating', 1] }, 1, 0] } },
          twoStar: { $sum: { $cond: [{ $eq: ['$review.rating', 2] }, 1, 0] } },
          threeStar: { $sum: { $cond: [{ $eq: ['$review.rating', 3] }, 1, 0] } },
          fourStar: { $sum: { $cond: [{ $eq: ['$review.rating', 4] }, 1, 0] } },
          fiveStar: { $sum: { $cond: [{ $eq: ['$review.rating', 5] }, 1, 0] } },
        }
      },
      {
        $project: {
          _id: 0,
          reviews: 1,
          averageReview: 1,
          ratingCount: {
            oneStar: '$oneStar',
            twoStar: '$twoStar',
            threeStar: '$threeStar',
            fourStar: '$fourStar',
            fiveStar: '$fiveStar'
          }

        }
      },
      
    ]
  )
  console.log(review)
  if (!review || (!review.reviews && !review.userReview)) {
    return false;
  }
  
  let reviews={reviews:review};
  reviews.userReview = review.reviews.find(item=>item.userId.equals(new mongoose.Types.ObjectId(userId)))

  
  return reviews
}