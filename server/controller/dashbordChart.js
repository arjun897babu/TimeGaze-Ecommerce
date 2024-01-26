const mongoose = require('mongoose');
const Order = require('../model/orderSchema')

exports.order = async (req, res, next) => {
  try {
    const { sort = '' } = req.query;
    const sorted = sort.trim() ? sort.trim().toLowerCase() : 'month';

    let matchQuery = {
      $match: {
        $and: [{
          'orderItems.orderStatus': 'delivered'
        }]
      }
    }
    let orderQuery = []
    let orderData = {}

    switch (sorted) {
      case 'week':
        const week = [{
          $addFields: {
            week: {
              $switch: {
                branches: [
                  { case: { $eq: [{ $dayOfWeek: '$orderDate' }, 1] }, then: "Sun" },
                  { case: { $eq: [{ $dayOfWeek: '$orderDate' }, 2] }, then: 'Mon' },
                  { case: { $eq: [{ $dayOfWeek: '$orderDate' }, 3] }, then: 'Tue' },
                  { case: { $eq: [{ $dayOfWeek: '$orderDate' }, 4] }, then: 'Wed' },
                  { case: { $eq: [{ $dayOfWeek: '$orderDate' }, 5] }, then: 'Thu' },
                  { case: { $eq: [{ $dayOfWeek: '$orderDate' }, 6] }, then: 'Fri' },
                  { case: { $eq: [{ $dayOfWeek: '$orderDate' }, 7] }, then: 'Sat' },
                ]
              }
            }
          },
        },
        {
          $group: {
            _id: '$week',
            total: { $sum: 1 }
          }
        }];
        let weekData = {
          'Sun': 0,
          'Mon': 0,
          'Tue': 0,
          'Wed': 0,
          'Thu': 0,
          'Fri': 0,
          'Sat': 0,
        }
        orderData = { ...weekData }
        orderQuery = [...week];
        matchQuery.$match.$and.push({
          $expr: {
            $eq:
              [
                {
                  $month: '$orderDate'
                }
                ,
                new Date().getMonth() + 1
              ]
          }
        }
        )

        break;
      case 'month':
        const month = [
          {
            $addFields: {
              month: {
                $switch: {
                  branches: [
                    { case: { $eq: [{ $month: '$orderDate' }, 1] }, then: "Jan" },
                    { case: { $eq: [{ $month: '$orderDate' }, 2] }, then: 'Feb' },
                    { case: { $eq: [{ $month: '$orderDate' }, 3] }, then: 'Mar' },
                    { case: { $eq: [{ $month: '$orderDate' }, 4] }, then: 'Apr' },
                    { case: { $eq: [{ $month: '$orderDate' }, 5] }, then: 'May' },
                    { case: { $eq: [{ $month: '$orderDate' }, 6] }, then: 'Jun' },
                    { case: { $eq: [{ $month: '$orderDate' }, 7] }, then: 'Jul' },
                    { case: { $eq: [{ $month: '$orderDate' }, 8] }, then: 'Aug' },
                    { case: { $eq: [{ $month: '$orderDate' }, 9] }, then: 'Sep' },
                    { case: { $eq: [{ $month: '$orderDate' }, 10] }, then: 'Oct' },
                    { case: { $eq: [{ $month: '$orderDate' }, 11] }, then: 'Nov' },
                    { case: { $eq: [{ $month: '$orderDate' }, 12] }, then: 'Dec' },
                  ]
                }
              }
            },
          },
          {
            $group: {
              _id: '$month',
              total: { $sum: 1 }
            }
          },

        ];
        let monthData = {
          'Jan': 0,
          'Feb': 0,
          'Mar': 0,
          'Apr': 0,
          'May': 0,
          'Jun': 0,
          'Jul': 0,
          'Aug': 0,
          'Sep': 0,
          'Oct': 0,
          'Nov': 0,
          'Dec': 0,
        }
        orderData = { ...monthData }
        orderQuery = [...month];
        matchQuery.$match.$and.push({
          $expr: {
            $eq: [
              {
                $year: '$orderDate'
              },
              new Date().getFullYear()
            ]
          }
        })
        break;
      case 'year':
        const year = [
          {
            $addFields: {
              year: { $year: '$orderDate' }
            }

          },
          {
            $group: {
              _id: '$year',
              count: { $sum: 1 }
            }
          }
        ];
        orderQuery = [...year];
        matchQuery.$match.$and.push({
          $expr: {
            $eq: [
              {
                $year: '$orderDate'
              },
              new Date().getFullYear()
            ]
          }
        })
        break;
    }

    const orderDetails = await Order.aggregate(
      [
        { $unwind: '$orderItems' },
        matchQuery,
        ...orderQuery
      ]
    );

    
    if (sort === 'year') {
      orderDetails.forEach(items => {
        orderData[items._id] = items.count
      })
    } else {
      orderDetails.forEach(items => {
        if (orderData.hasOwnProperty(items._id)) {
          orderData[items._id] = items.total
        }
      })
    }

    res.status(200).json({ status: 'success', orderData: orderData })
  } catch (error) {
    next(error);
  }
}