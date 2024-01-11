const mongoose = require('mongoose');
const Cart = require('../model/cartSchema');
const User = require('../model/userModelSchema');
const Product = require('../model/productSchema');
const queryString = require('querystring')

exports.addToCart = async (req, res, next) => {
  try {

    const userId = req.session.userId

    if (!userId) return res.status(401).redirect('/login')

    const { productId } = req.params;

    const availableProducts = await Product.aggregate(
      [
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category'
          }
        },
        { $unwind: '$category' },
        {
          $match: {
            $and: [
              {
                _id: new mongoose.Types.ObjectId(productId),
                unlisted: false
              },
              {
                'category.unlisted': false
              }
            ]
          }
        }
      ]
    )

    const availableProduct = availableProducts[0]

    if (availableProducts.length < 1) return res.redirect('/productList');

    if (availableProduct.quantity < 1) return res.redirect(`/singleProduct?productId=${availableProduct.productName}`)


    const existingCart = await Cart.findOne({ userId: userId });

    if (existingCart) {

      existingCart.cartItem.push({ product: productId, })
      existingCart.cartTotal += availableProduct.discountPrice;

      await existingCart.save()

    } else {
      const newCart = new Cart({
        userId: userId,
        cartItem: [{ product: productId, }],
        cartTotal: availableProduct.discountPrice,
      });

      await newCart.save()
    }

    res.status(200).redirect(`/singleProduct?product=${availableProduct.productName}`);

  } catch (error) {
    console.log(error.message)
    next(error)
  }
}

exports.getUserCart = async (req, res, next) => {
  try {
    const { userId } = req.params;
    console.log(userId);

    const userCart = await Cart.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId)
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
        $unwind: '$cartItem'
      },
      {
        $lookup: {
          from: 'products',
          localField: 'cartItem.product',
          foreignField: '_id',
          as: 'cartItem.product'
        }
      },
      {
        $unwind: '$cartItem.product'
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          'user.password': 0,
          'user.isBlocked': 0,
          'user.isVerified': 0,
          'user.__v': 0,
          'user.adress': 0,
          'user.email': 0,
          'user._id': 0,
          'userId': 0,
        }
      }

    ]);

    if (userCart) {
      res.send(userCart)
    } else {
      res.send(null)
    }

    console.log(userCart)

  } catch (error) {
    res.send(error.message)
  }
}

exports.removeCartItem = async (req, res, next) => {
  try {
    const { cartItemId } = req.params;
    const userId = req.session.userId;
    console.log(cartItemId, userId);
    const userCart = await Cart.findOne({ userId: userId }).populate('cartItem.product');


    if (userCart) {

      const indexOfItem = userCart.cartItem.findIndex((item) =>
        item._id.equals(new mongoose.Types.ObjectId(cartItemId))
      );
      let removeCartItem = userCart.cartItem.splice(indexOfItem, 1);
      console.log(removeCartItem)
      const newCartTotal = userCart.cartItem.reduce((total, item) => {
        let productPrice = item.product.discountPrice || 0;
        return total + item.quantity * productPrice;
      }, 0);
      userCart.cartTotal = newCartTotal;
      const newCart = await userCart.save();
      res.send(newCart)
    }



  } catch (error) {
    res.send(error.message)
  }
}

exports.cartQuantity = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const { cartItem } = req.params;
    const { newQuantity } = req.body;
    console.log(newQuantity);

    if (userId !== 'undefined' && userId !== '' && cartItem !== 'undefined' && cartItem !== '' && newQuantity) {
      const existCartItem = await Cart.findOne({
        userId: userId
      }).populate('cartItem.product');

      if (existCartItem) {
        const indexOfItem = existCartItem.cartItem.findIndex((item) =>
          item.product._id.equals(new mongoose.Types.ObjectId(cartItem))
        );
        console.log(existCartItem.cartItem[indexOfItem])
        if (existCartItem.cartItem[indexOfItem].product.quantity >= newQuantity) {
          existCartItem.cartItem[indexOfItem].quantity = newQuantity;
          const newCartTotal = existCartItem.cartItem.reduce((total, item) => {
            let productPrice = item.product.discountPrice || 0;
            return total + item.quantity * productPrice;
          }, 0);
          existCartItem.cartTotal = newCartTotal;
          await existCartItem.save();
          res.status(200).send('quantity changed');
        } else {
          res.status(404).send('Out of stock');
        }
      }
    } else {
      res.status(400).send('Missing parameters');
    }
  } catch (error) {
    next(error);
  }
};
