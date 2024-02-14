const mongoose = require('mongoose')
const Coupen = require('../model/coupenSchema');
const queryString = require('querystring');

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
exports.couponWithPagination = async(req)=>{
  try{
    let { pageNumber } = req.query;

    if (!req.query.hasOwnProperty('pageNumber') || req.query.pageNumber === '' || req.query.pageNumber < 1) {
      req.query.pageNumber = 1;
      pageNumber = 1
    }
    const perPage = 5;
    const startIndex = Math.ceil((pageNumber - 1) * perPage);
    const endIndex = Math.ceil(startIndex + perPage);
    let searchQuery = {};
    let statusQuery = {};
    let selected = {};

    for ([key, value] of Object.entries(req.query)) {
      if (key === 'search' && value.trim() !== '') {
        searchQuery = {
          $or: [
            {
              code: {
                $regex: `^${value.trim()}`,
                $options: 'i'
              }
            }
          ]
        };
        selected[key] = value
      } if (key === 'status' && value.trim() !== '') {
        if(value.trim()==='expired'){
          statusQuery = {expiry: {$lt:new Date()}};
        }else if(value.trim()==='active'){
          statusQuery = {expiry: {$gt:new Date()} };
        }
        selected[key] = value
      }
    };

    const aggregationPipleLine=[
      {$match:searchQuery},
      {$match:statusQuery},
    ]

    const coupon = await Coupen.aggregate([...aggregationPipleLine,{$skip:startIndex},{$limit:perPage}])
    const [count] = await Coupen.aggregate([...aggregationPipleLine,{$count:'totalCount'}]);
    const totalPages = Math.ceil((count?.totalCount || 0) / perPage);
    const path = queryString.stringify(req.query);

    return {
        coupon,
        totalPages: {
          totalPages,
          startIndex,
          endIndex,
          pageNumber,
          path
        },
        selected
      }
    

  }catch(error){
    throw error
  }
}