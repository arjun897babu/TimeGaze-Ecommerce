

//calculate discout
exports. calculateDiscount = (coupon, cartTotal)=> {
 if(!coupon) return undefined
  let discountPrice = coupon.isPercentage
    ? Math.min((cartTotal * coupon.discount) / 100, coupon.maxDiscount)
    : coupon.discount;
  return discountPrice;

}