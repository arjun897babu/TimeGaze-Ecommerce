const mongoose = require('mongoose');
const Order = require('../model/orderSchema');
const Product = require('../model/productSchema');
const User = require('../model/userModelSchema');
const Cart = require('../model/cartSchema');
const Address = require('../model/addressSchema');
const coupenHelper = require('../utilities/coupen');
const Razorpay = require('razorpay');
const crypto = require("crypto");

const instance = new Razorpay(
  {
    key_id: process.env.rzp_key,
    key_secret: process.env.rzp_secret
  }
);

exports.createOrder = async (req, res, next) => {
  try {

    const { userId, addressId, coupon } = req.session;
    const { selectedAddressId } = req.params;
    const { PaymentOption } = req.body

    if (!PaymentOption || !selectedAddressId) return res.status(400).send('all field are required');

    //checking the address is the defualt address
    const existingAddress = await Address.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(addressId) }
      },
      {
        $unwind: '$address'
      },
      {
        $match: {
          $and: [
            { 'address._id': new mongoose.Types.ObjectId(selectedAddressId) },
            { 'address.defaultAdress': true }
          ]
        }
      },
    ]);

    //checking cart is exist
    const existingCart = await Cart.aggregate(
      [
        {
          $match:
            { userId: new mongoose.Types.ObjectId(userId) }
        },

        {
          $lookup: {
            from: 'products',
            localField: 'cartItem.product',
            foreignField: '_id',
            as: 'singleProduct',
          }
        },
      ]
    )

    //checking all items in cart are valid
    const valid = existingCart[0].cartItem.map((cartItem) => {
      const correspondingProduct = existingCart[0].singleProduct.find(
        product =>
          product._id.equals(new mongoose.Types.ObjectId(cartItem.product))
      );

      if (!correspondingProduct || cartItem.quantity > correspondingProduct.quantity || correspondingProduct.unlisted)
        return false;
      else
        return true;

    });

    const isValid = valid.every(bolean => bolean);

    if (existingAddress.length === 0 || !isValid) {

      return res.status(404).json({ status: 'failed', message: 'some product is outOf stock', redirectUrl: '/cart' })
    }

    //creating billing address
    const billingAddress = {
      name: existingAddress[0].address.name,
      mobileNumber: existingAddress[0].address.mobileNumber,
      district: existingAddress[0].address.district,
      pincode: existingAddress[0].address.pincode,
      address: existingAddress[0].address.address,
      locality: existingAddress[0].address.locality,
      state: existingAddress[0].address.state,
      addressType: existingAddress[0].address.addressType
    }

    //creating orderItems
    const cartItems = existingCart[0].cartItem.map((cartItem) => {

      const matchingProduct = existingCart[0].singleProduct.find(
        product => product._id.equals(new mongoose.Types.ObjectId(cartItem.product))
      );

      return {
        product: matchingProduct._id,
        productName: matchingProduct.productName,
        caseDiameter: matchingProduct.caseDiameter,
        caseShape: matchingProduct.caseShape,
        price: matchingProduct.price,
        discountPrice: matchingProduct.discountPrice,
        offer: matchingProduct.offer,
        quantity: cartItem.quantity,
        productTotal: cartItem.quantity * matchingProduct.discountPrice,
        image: matchingProduct.image,
      };
    });

    //random orderId
    const orderID = Math.floor(Math.random() * 1000000).toString();
    //calculate discount price
    const discountPrice = coupenHelper.calculateDiscount(coupon, existingCart[0].cartTotal);

    //creating new order
    const newOrder = new Order({
      userId: userId,
      orderId: orderID,
      orderItems: cartItems,
      address: billingAddress,
      paymentMethod: PaymentOption,
      coupon: coupon ? coupon.code : null,
      discount: coupon ? discountPrice : 0,
      total: coupon ? existingCart[0].cartTotal - discountPrice : existingCart[0].cartTotal
    })


    if (PaymentOption === 'cashOnDelivery') {

      const savedOrder = await newOrder.save();
      console.log('savedorder', savedOrder)

      await Cart.updateOne(
        { userId: userId },
        { $set: { cartItem: [], cartTotal: 0 } }
      );
      console.log('new order', newOrder.orderItems)
      const bulkoperation = newOrder.orderItems.map(function (items) {
        return {
          updateOne: {
            filter: { _id: items.product },
            update: { $inc: { quantity: -(items.quantity) } }
          }
        }
      });


      console.log('new bulkoperation', bulkoperation)


      console.log('new bulkoperation', bulkoperation)

      await Product.bulkWrite(bulkoperation);
      req.session.isOrder = true;
      delete req.session.coupon
      console.log('session for order', req.session.isOrder)
      res.status(200).json(
        {
          paymentMethod: PaymentOption,
          message: 'order placed successFully',
          status: 'success',
          redirectUrl: '/orderSuccess'
        }
      )
    }
    if (PaymentOption === 'onlinePayment') {
      const options = {
        amount: newOrder.total * 100,
        currency: "INR",
        receipt: "" + newOrder.orderId,
      };
      const order = await instance.orders.create(options);
      console.log(order)
      req.session.newOrder = newOrder;

      res.json({
        order,
        payMethode: "onlinePayment",
        razorKey: process.env.rzp_key,

      });
    }

  }
  catch (error) {
    res.send(error);
  }
}

exports.getOrderDetails = async (req, res, next) => {
  try {
    const { userId } = req.params

    if (!userId) return res.send('user not logged in')
    const getOrderDetails = await Order.aggregate(
      [
        {
          $match:
          {
            userId: new mongoose.Types.ObjectId(userId)
          }
        }
        ,
        { $unwind: '$orderItems' }
        ,
        { $sort: { orderDate: -1 } },
        {
          $project: {
            'orderItems._id': 1,
            'orderItems.orderStatus': 1,
            'orderItems.productName': 1,
            'orderItems.price': 1,
            'orderItems.discountPrice': 1,
            'orderItems.image': 1
          }
        }
      ]
    );

    if (getOrderDetails.length > 0) {
      res.status(200).send(getOrderDetails)
    } else {
      res.send(null)
    }

  } catch (error) {
    next(error)
  }
}

exports.getAllOrderDetails = async (req, res, next) => {
  try {

    const getOrderDetails = await Order.aggregate(
      [
        { $match: {} },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userDetails'
          },
        },
        { $unwind: '$orderItems' }
        ,
        { $sort: { orderDate: -1 } },
        {
          $project:
          {
            'userDetails.password': 0,
            'userDetails.adress': 0
          }
        }
      ]);

    if (getOrderDetails.length > 0) {
      res.status(200).send(getOrderDetails)
    } else {
      res.send(null)
    }

  } catch (error) {
    next(error)
  }
}

exports.changeStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, cancelReason, returnReason } = req.body;
    console.log(orderStatus, cancelReason, returnReason)

    if (orderStatus === 'cancel' && cancelReason === '') return res.status(400).json(
      {
        status: 'error',
        message: 'Please provide a reason for the cancel'
      }
    );
    if (orderStatus === 'return_requested' && returnReason === '') return res.status(400).json(
      {
        status: 'error',
        message: 'Please provide a reason for the return'
      }
    );

    if (orderStatus === 'canceled' ) {
      const url = '/api/cancelOrder' 
      const [usedCoupon] = await Order.aggregate([
        {
          $match: {
            'orderItems': {
              $elemMatch: { _id: new mongoose.Types.ObjectId(orderId) }
            },
            coupon: { $ne: null }
          }
        },
        {
          $group: {
            
            _id: {
              _id: '$_id',
              coupon: '$coupon',
              total: '$total',
              length:{$size:'$orderItems'}
            }
          }
        }
      ]);
      
      console.log(usedCoupon)
      
      if (usedCoupon&&usedCoupon._id.length>1) return res.status(202).json(
        {
          message: 'Canceling this order will also cancel all products purchased with the coupon',
          url: url,
          orderItemsId: usedCoupon._id._id

        }
      )
    }


    const updatedOrder = await Order.findOneAndUpdate(
      {
        'orderItems':
        {
          $elemMatch:
            { _id: orderId }
        }
      },
      {
        $set:
        {
          'orderItems.$.orderStatus': orderStatus,
          'orderItems.$.cancelReason': cancelReason,
          'orderItems.$.ReturnReason': returnReason
        }
      },
      {
        new: true,
      }
    );

    if (orderStatus === 'canceled') {

      let product = {};

      for (const items of updatedOrder.orderItems) {
        if (items._id.equals(new mongoose.Types.ObjectId(orderId))) {
          product.quantity = items.quantity;
          product._id = items.product;
          break;
        }
      }


      await Product.findByIdAndUpdate(
        product._id,
        {
          $inc:
            { quantity: product.quantity }
        },

      );
    }


    return res.status(200).json(
      {
        status: 'success',
        message: orderStatus
      }
    );

  }
  catch (error) {
    next(error)
  }
}

exports.getSingleOrderDetails = async (req, res, next) => {
  try {

    const { soid } = req.params;
    const singleOrder = await Order.aggregate([
      {
        $match: {
          'orderItems': {
            $elemMatch: { _id: new mongoose.Types.ObjectId(soid) }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $project: {
          userId: 0,
          'user._id': 0,
          'user.password': 0,
          'user.isBlocked': 0,
          'user.isVerified': 0,
          'user.__v': 0,
          'user.adress': 0,
        }
      }
    ]);

    res.json(singleOrder)

  } catch (error) {
    console.log(error.messagge)
    res.send(error.message)
  }
}
exports.payOnline = async (req, res, next) => {
  try {

    const { userId } = req.session
    const hmac = crypto.createHmac("sha256", process.env.rzp_secret);
    hmac.update(
      req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id
    );

    if (hmac.digest("hex") === req.body.razorpay_signature) {
      const newOrder = new Order(req.session.newOrder);

      const savedOrder = await newOrder.save();

      await Cart.updateOne(
        { userId: userId },
        { $set: { cartItem: [], cartTotal: 0 } }
      );
      const bulkoperation = newOrder.orderItems.map(function (items) {
        return {
          updateOne: {
            filter: { _id: items.product },
            update: { $inc: { quantity: -(items.quantity) } }
          }
        }
      });
      await Product.bulkWrite(bulkoperation);
      req.session.isOrder = true;
      delete req.session.coupon
      return res.status(200).redirect("/orderSuccess");
    } else {
      return res.send("Order Failed");
    }

  } catch (error) {
    next(error);
  }
}


exports.cancelOrder = async (req, res, next) => {
  try {
    const { orderItemsId } = req.params;
    const { orderStatus, cancelReason } = req.body;
    console.log(orderItemsId, orderStatus, cancelReason);
    if (orderStatus === 'canceled' && cancelReason === '') {
      return res.status(400).json(
        {
          status: 'error',
          message: 'Please provide a reason for the cancel'
        }
      );
    }

    const productDetails = await Order.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(orderItemsId) },
      },
      { $unwind: '$orderItems' }
      ,
      {
        $group: {
          _id: '$orderItems.product',
          quantity: { $sum: '$orderItems.quantity' },
          total: { $sum: '$total' },
        }
      },

    ]);

    const bulkoperation = productDetails.map(function (items) {
      return {
        updateOne: {
          filter: { _id: items._id },
          update: { $inc: { quantity: (items.quantity) } }
        }
      }
    });
 
    await Order.updateMany(
      { _id: orderItemsId },
      {
        $set: {
          'orderItems.$[].orderStatus': orderStatus,
          'orderItems.$[].cancelReason': cancelReason
        }
      }
    );

    await Product.bulkWrite(bulkoperation)

    res.status(200).json({
      status:'success',
      message: 'Order canceled Successfully'
    })

  } catch (error) {

  }
}

exports.returnOrder = async (req, res, next) => {
  try {
    const { orderItemsId } = req.params;
    const { orderStatus, returnReason } = req.body;
    console.log(orderItemsId, orderStatus, returnReason);


    if (orderStatus === 'return_requested' && returnReason === '') return res.status(400).json(
      {
        status: 'error',
        message: 'Please provide a reason for the return'
      }
    );

    await Order.updateMany(
      { _id: orderItemsId },
      {
        $set: {
          'orderItems.$[].orderStatus': orderStatus,
          'orderItems.$[].returnReason': returnReason
        }
      }
    );

    res.status(200).json({
      status:'success',
      message: 'Order return requested Successfully'
    })


  } catch (error) {
    next(error)
  }
}






