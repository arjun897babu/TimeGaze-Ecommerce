const { default: mongoose } = require('mongoose');
const mongooose =  require('mongoose');

const addressSchema = new mongoose.Schema({

  address:[{
    name:{
      type:String,
      
    },
    mobileNumber:{
      type:Number

    },
    district:{
      type:String,
    },
    pincode:{
      type:Number
    },
    locality:{
      type:String,
    },
    address:{
      type:String,
    },
    state:{
      type:String,
    },
    addressType:{
      type:String,
    },
    defaultAdress:{
      type:Boolean,
      default:false
    }
  }],

})

const address = mongoose.model('address',addressSchema);
module.exports = address;