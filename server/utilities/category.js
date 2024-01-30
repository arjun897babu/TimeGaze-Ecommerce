const mongoose = require('mongoose');
const Category = require('../model/categorySchema');

exports.allCategory = async () => {
  return await Category.aggregate(
    [
      { $match: { unlisted: false } },
      {
        $project: {
          _id: 1,
          categoryName: 1
        }
      }
    ]
  )
}
