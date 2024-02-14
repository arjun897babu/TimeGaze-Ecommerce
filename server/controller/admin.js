const { response } = require('express');
const User = require('../model/userModelSchema');
const { default: mongoose } = require('mongoose');
const Order = require('../model/orderSchema');
const Json2csvParser = require('@json2csv/plainjs').Parser;
const fs = require('fs');
const Product = require('../model/productSchema');
const Offer = require('../model/offerSchema')
const adminDetails = {
  emailAddress: process.env.admin_email,
  password: process.env.admin_password
}

exports.adminLogin = (req, res, next) => {
  const { email, password } = req.body;


  if (!email && !password) {
    req.session.errorMessage = 'All fields are required'
    console.log('all fields are required');
    res.status(401).redirect('/adminLogin')
  } else if (email != adminDetails.emailAddress) {
    req.session.errorMessage = 'Invalid email'
    console.log('Invalid email');
    res.status(401).redirect('/adminLogin')
  } else if (password != adminDetails.password) {
    req.session.errorMessage = 'Invalid password'
    console.log('Invalid password');
    res.status(401).redirect('/adminLogin');
  } else {
    console.log('verified');
    req.session.isAuthed = true;
    res.status(200).redirect('/adminHome');
  }

}

exports.adminLogout = (req, res) => {
  req.session.destroy();
  res.status(200).redirect('/adminLogin');
}


exports.findAllUser = async (req, res, next) => {
  try {

    const { pageNumber, status, search = '' } = req.query;



    const users = await User.find({});
    if (!users) {
      res.send('no user')
    } else {
      res.send(users)
    }
  }
  catch (error) {
    next(error)
  }
}


//blocking and unblocking the user


//block user
exports.blockUser = async (req, res) => {
  try {

    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked: true },
      { new: true }
    );
    if (user) {
      req.session.userBlocked = true;

      res.status(200).send('User blocked successfully');
    } else {
      res.status(404).send('User not found');
    }


  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};


//unblock user
exports.unblockUser = async (req, res, next) => {
  try {

    const { userId } = req.params

    const user = await User.findByIdAndUpdate(userId, { isBlocked: false }, { new: true });

    if (user) {

      res.status(200).send(`${user} blocked`)
    } else {
      res.status(404).send('user not found')
    }

  }
  catch (error) {
    res.status(500).send(error.message)

  }
}

exports.salesReport = async (req, res, next) => {
  try {
    const { fileExtension, startDate, endDate } = req.query;

    if (fileExtension !== 'pdf' && fileExtension !== 'excel') return res.status(400).redirect('/adminHome')

    let matchQuery = {};

    if (startDate) {
      matchQuery.orderDate = {
        ...matchQuery.orderDate,
        $gte: new Date(startDate)
      };
      matchQuery.orderDate.$gte.setUTCHours(0, 0, 0, 0);

    }
    if (endDate) {
      matchQuery.orderDate = {
        ...matchQuery.orderDate,
        $lte: new Date(endDate)
      };
      matchQuery.orderDate.$lte.setUTCHours(23, 59, 59, 999)
    }

    const fields = ['orderId',
      'productName',
      'quantity',
      'offer',
      'specialOffer',
      'extraOffer',
      'productTotal',
      'orderStatus',
      'reason',
      'paymentMethod',
      'coupon',
      'orderDate'
    ];

    const orderData = await Order.aggregate(
      [
        {
          $match: matchQuery
        },

        { $unwind: '$orderItems' },

        {
          $project: {
            _id: 0,
            orderId: 1,
            'productName': '$orderItems.productName',
            'quantity': '$orderItems.quantity',
            'offer': '$orderItems.offer',
            'specialOffer': '$orderItems.specialOffer',
            'extraOffer': '$orderItems.extraOffer',
            'productTotal': '$orderItems.productTotal',
            'orderStatus': '$orderItems.orderStatus',
            'reason': '$orderItems.reason',
            paymentMethod: 1,
            coupon: 1,
            orderDate: {
              $dateToString: {
                format: "%d-%m-%Y",
                date: "$orderDate",
                timezone: "Asia/Kolkata"
              }
            }
          }
        }
      ]
    );

    if(orderData.length<2) {
      req.session.noOrder = 'No order Found';
      return res.redirect('/adminHome');
    }

    //for calculating the total quanity,productamount,and order amount
    let totalQuantity = 0, totalProductTotal = 0, grandTotal = 0;
    orderData.forEach(order => {
      totalQuantity += order.quantity;
      totalProductTotal += order.productTotal;
    });

    //for adding a line at the end of the summary
    let summary = {
      orderId: 'Total',
      productName: '',
      quantity: totalQuantity,
      productTotal: totalProductTotal,
      orderStatus: '',
      reason: '',
      paymentMethod: '',
      total: '',
      coupon: '',
      orderDate: ''
    };
    orderData.push(summary);

    const parser = new Json2csvParser({ fields });
    const csv = parser.parse(orderData);
    // fs.writeFileSync("sales.csv", csv);
    if (fileExtension === 'excel') {
      res.setHeader('Content-type', 'text/csv')
      res.setHeader('Content-disposition', 'attachment;filename = sales_report.csv')
      return res.status(200).send(csv);

    } else {
      
     
    }

  } catch (error) {
    next(error)
  }
}
//create a middleware for checking the product and category is not unlisted
exports.addOffer = async (req, res, next) => {
  try {
    const { offer, category, product, discount, expiry } = req.body;
    console.log(req.body, category, product, discount, expiry);

    let errorMessage = {}
    if (discount === '' || !discount || discount % 1 !== 0 || discount < 1 || discount > 20) {
      errorMessage.discount = 'enter a valid discount'
    }
    if (!expiry || new Date(expiry) < new Date()) {

      errorMessage.expiry = 'choose a valid expiry date'
    }
    if (Object.keys(errorMessage).length > 0) {
      req.session.errorMessage = errorMessage;
      console.log(req.session.errorMessage)
      return res.status(400).redirect('/addOffer')
    }

    const newOffer = new Offer({
      offerType: offer,
      item: category ?? product,
      discount: discount,
      expiry: expiry
    })
    const createdOffer = await newOffer.save()

    if (offer === 'category') {
      await Product.updateMany(
        {
          category: category
        },
        {
          $set: {
            'categoryOffer.offer': newOffer._id,
            'categoryOffer.discount': newOffer.discount,
            'categoryOffer.expiry': newOffer.expiry
          }
        }
      );
    }
    if (offer === 'product') {
      await Product.findByIdAndUpdate(
        product,
        {
          $set: {
            'productOffer.offer': newOffer._id,
            'productOffer.discount': newOffer.discount,
            'productOffer.expiry': newOffer.expiry
          }
        }
      )
    }
    req.session.successMessage = `New ${offer} offer is added`
    return res.status(200).redirect('/adminOffer')
  } catch (error) {
    next(error)
  }
}

