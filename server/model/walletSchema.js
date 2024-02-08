const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  balance:{
    type:Number,
    default:0
  },
  transactions:[
    {
      amount:{
        type:Number
      },
      transactionType: {
        type: String,
      }
      ,
      transactionDate:{
        type:Date,
        default:Date.now()
      }
    }
  ]
},{timestamps:true});

const Wallet = mongoose.model('Wallet',walletSchema);
module.exports = Wallet;