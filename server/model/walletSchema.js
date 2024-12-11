const mongoose = require('mongoose');
const { generateUUID } = require('../utilities/random-id-generator');

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
      },
      transactionId:{
        type:String
      }
    }
  ]
},{timestamps:true});

walletSchema.pre('findOneAndUpdate',function(next){
  const update = this.getUpdate(); 
  if(update&&update?.$push&&update?.$push?.transactions){
    const transaction = update.$push.transactions; 
    if (!transaction.transactionId) {
      transaction.transactionId = generateUUID();
    }
  }
  next()
})

const Wallet = mongoose.model('Wallet',walletSchema);
module.exports = Wallet;