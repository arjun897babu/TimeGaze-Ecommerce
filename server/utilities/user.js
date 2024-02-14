const mongoose = require('mongoose')
const User = require('../model/userModelSchema');
const queryString = require('querystring');

exports.userCount = async function () {
  return User.aggregate(
    [
      {
        $group:
        {
          _id: null,
          count: { $sum: 1 }
        }
      }

    ]
  )
}

exports.findAlluser = async (req)=>{
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
        const phoneNumber = parseInt(value.trim(), 10);
        const conditions = [
          { name: { $regex: `^${value.trim()}`, $options: 'i' } },
          { email: { $regex: `^${value.trim()}`, $options: 'i' } },
        ];
        if (!isNaN(phoneNumber)) {
          conditions.push({ phoneNumber: phoneNumber });
        }
        searchQuery = { $or: conditions };
        selected[key] = value
      }if (key === 'status' && value.trim() !== '') {
        if(value.trim().toLowerCase()==='blocked'){
          statusQuery = {isBlocked: true};
        }else if(value.trim().toLowerCase()==='active'){
          statusQuery = {isBlocked: false};
        }
        selected[key] = value
      }
    };

    const aggregationPipleLine=[
      {$match:{...searchQuery}},
      {$match:{...statusQuery}},
    ]
    const users = await User.aggregate([...aggregationPipleLine,{$skip:startIndex},{$limit:perPage}]);
    const [count] = await User.aggregate([...aggregationPipleLine,{$count:'totalCount'}]);
    const totalPages = Math.ceil((count?.totalCount || 0) / perPage);
    const path = queryString.stringify(req.query);
    return {
        users,
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