const mongoose = require('mongoose');


const offerSchema = new mongoose.Schema({
  offerType: {
    type: String
  },
  item: {
    type: mongoose.Schema.Types.ObjectId
  },
  discount: {
    type: Number
  },
  expiry: {
    type: Date,
  }
});

offerSchema.index({ expiry: 1 }, { expireAfterSeconds: 0 });


const Offer = mongoose.model('Offer', offerSchema);
module.exports = Offer