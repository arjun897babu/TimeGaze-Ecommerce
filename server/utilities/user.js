const mongoose = require('mongoose')
const User = require('../model/userModelSchema');

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