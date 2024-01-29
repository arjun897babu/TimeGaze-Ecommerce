const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Product'
  },
  review: [{

    userId:{  
      type:mongoose.Schema.Types.ObjectId,
      ref:'User'
    } ,
    reviewText: {
      type: String
    },
    rating: {
      type: Number,
      
    }

  }]

})

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;