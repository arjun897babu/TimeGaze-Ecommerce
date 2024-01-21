const mongoose = require('mongoose')
const Coupen = require('../model/coupenSchema');
//calculate discout
exports. calculateDiscount = (coupon, cartTotal)=> {
 if(!coupon) return undefined
  let discountPrice = coupon.isPercentage
    ? Math.min((cartTotal * coupon.discount) / 100, coupon.maxDiscount)
    : coupon.discount;
  return discountPrice;

}

exports.getAllCoupon = async ()=>{
  try{
    return await Coupen.aggregate([{$match:{}}]);
  }catch(error){
    throw error
  }
}