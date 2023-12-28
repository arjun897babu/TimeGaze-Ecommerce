const mongoose = require('mongoose');
const Cart = require('../model/cartSchema');
const User = require('../model/userModelSchema');
const Product = require('../model/productSchema');

exports.addToCart = async (req, res) => {
  try {

    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).redirect('/login')
    }

    const { productId } = req.params;

    console.log('user email and addressId,productId', userId, productId);
    if (!productId) return res.send('preoduct id is missiin');

    const availableProduct = await Product.findById(productId);

    console.log(availableProduct)
    if (availableProduct.quantity > 0) {

      const existingCart = await Cart.findOne({ userId: userId });
      console.log('existing cart', existingCart)
      if (existingCart) {

        existingCart.cartItem.push({ product: productId, })
        existingCart.cartTotal += availableProduct.discountPrice;


        await existingCart.save()
        res.send('product added to the existing cart');

      } else {
        const newCart = new Cart({
          userId: userId,
          cartItem: [{ product: productId, }],
          cartTotal: availableProduct.discountPrice,
        });


        await newCart.save();
        res.send('product added to the cart')
      }



    }
    else {
      res.send('product out of stock')
    }
  } catch (error) {
    console.log(error.message)
    res.status(500).send('internel server error')
  }
}

exports.getUserCart = async (req, res) => {
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

exports.removeCartItem = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const userId = req.session.userId = '658275a8be7448200852a4c7';
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