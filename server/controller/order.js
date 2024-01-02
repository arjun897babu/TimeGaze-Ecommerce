const mongoose = require('mongoose');
const Order = require('../model/orderSchema');
const Product = require('../model/productSchema');
const User = require('../model/userModelSchema');
const Cart = require('../model/cartSchema');
const Address = require('../model/addressSchema');

exports.createOrder = async (req, res, next) => {
  try {

    const { userId, addressId } = req.session;
    const { selectedAddressId } = req.params;
    const { PaymentOption } = req.body

    console.log(userId, addressId, selectedAddressId, PaymentOption)
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
      let error = new Error('not found');
      error.status = 404
      return next(error)
    }

    //creating billing address
    const billingAddress = {
      name: existingAddress[0].address.name,
      mobileNumber: existingAddress[0].address.mobileNumber,
      district: existingAddress[0].address.district,
      pincode: existingAddress[0].address.pincode,
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

    //creating new order
    const newOrder = new Order({
      userId: userId,
      orderItems: cartItems,
      address: billingAddress,
      paymentMethod: PaymentOption
    })

    const savedOrder = await newOrder.save();

    if (savedOrder) {

      await Cart.updateOne(
        { userId: userId },
        { $set: { cartItem: [] } }
      );

      const bulkoperation = cartItems.map(function (items) {
        return {
          updateOne: {
            filter: { _id: items.product },
            update: { $inc: { quantity: -(items.quantity) } }
          }
        }
      });

      console.log('this is bulkoperation', bulkoperation)

      await Product.bulkWrite(bulkoperation);
      res.send('product added to the cart')

    }
    else {
      throw new Error('order is canceld')
    }


  }
  catch (error) {
    res.send(error);
  }
}

exports.getOrderDetails = async (req, res, next) => {
  try {
    const { userId } = req.params
    console.log(userId)
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
    res.send(error.message)
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
    res.send(error.message)
  }
}