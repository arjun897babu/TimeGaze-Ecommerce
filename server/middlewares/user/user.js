
const mongoose = require('mongoose')
const User = require('../../model/userModelSchema');
const Cart = require('../../model/cartSchema');
const Product = require('../../model/productSchema');
//user verified or not for new regirstered usr
exports.isUserTrue = async (req, res, next) => {
  try {

    const { email, password } = req.body;

    const users = await User.findOne({ email });

    if (!users) {
      return next()
    }
    if (users.isVerified) {

      next();
    } else {
      req.session.invalidMessage = 'Your are not verified,please register after some times';
      await User.deleteOne({ email })
      console.log('user not verified');
      res.status(401).redirect('/login')
    }

  } catch (error) {
    res.status(500).send(error.message)
  }
}




//user is authenticated
exports.isUser = (req, res, next) => {

  if (req.session.isUserAuth) {

    return res.redirect(req.session.redirectUrl || '/');
  } else {
    console.log(req.session.redirectUrl)
    next();
  }
};

exports.notUser = (req, res, next) => {

  if (req.session.isUserAuth) {
    req.session.redirectUrl = req.originalUrl;

    next();

  } else {
    
    res.redirect('/login');
  }
};


// check user is blocked or not

exports.isBlocked = async (req, res, next) => {
  try {
    const userEmail = req.session.email;

    if (!userEmail) {
      return next()
    }
    if (userEmail) {
      const userBlocked = await User.findOne({ email: userEmail });

      if (userBlocked.isBlocked) {

        req.session.destroy();
        res.redirect('/login');
      } else {
        next()
      }
    }

  }
  catch (error) {
    res.status(500).send('internal server error')
  }
}

//orderPage middle ware
exports.cartIsTrue = async (req, res, next) => {
  try {
    console.log(req.originalUrl)
    const { userId } = req.session;
    console.log(userId);

    const cartExists = await Cart.exists({
      userId: userId,
      'cartItem': { $exists: true, $not: { $size: 0 } }
    });

    console.log('cartIstrue middle ware', cartExists)

    if (cartExists) {
      next();
    } else {
      res.status(401).redirect('/');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


//success page middleWare

exports.isOrder = async (req, res, next) => {
  try {
    const { isOrder } = req.session

    if (isOrder) next();

    else res.status(401).redirect('/');

  } catch (error) {
    next(error)
  }
}


exports.singleProduct = async (req, res, next) => {

  try{
    const { pid = '' } = req.query;
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.redirect('/productList');
      
    }
  
    const existingProduct = await Product.aggregate([
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
              _id: new mongoose.Types.ObjectId(pid),
              unlisted: false
            },
            {
              'category.unlisted': false
            }
          ]
        }
      }
    ]);
  
    if (existingProduct.length === 1) next();
  
    else return res.redirect('/productList');

  }catch(error){
    next(error)
  }

}

exports.isUserEmail = (req, res, next)=>{
  if (req.session.useremail) {
    next()
  } else {
    res.redirect('/login')
  }
}
