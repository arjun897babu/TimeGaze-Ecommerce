const axios = require('axios');
const { error } = require('console');
const queryString = require('querystring')
const Wallet = require('../utilities/wallet')
const coupenHelper = require('../utilities/coupen');
const ReviewHelper = require('../utilities/review');
const OrderHelper = require('../utilities/order');
const categoryHelper = require('../utilities/category');
const statesHelper = require('../utilities/states');
const addressHelper = require('../utilities/address');
const productHelper = require('../utilities/product')



module.exports = {
  home: async (req, res, next) => {
    try {
      const products = await productHelper.newProducts();
      const categories = await categoryHelper.allCategory();
      res.status(200).render('index',
        {
          logged: req.session.isUserAuth,
          products,
          categories,
        }
      )

    }
    catch (error) {
      next(error)
    }

  },
  login: (req, res) => {
    res.render('user/user_login', { registerdEmail: req.session.useremail, errorMessage: req.session.invalidMessage, logged: req.session.isUserAuth }, (error, html) => {

      if (error) {
        return res.send(error)
      }
      delete req.session.useremail;
      delete req.session.invalidMessage;
      res.send(html);

    });
  },
  signup: (req, res) => {
    res.render('user/user_signup', { errorMessage: req.session.errorMessage, logged: req.session.isUserAuth }, (error, html) => {
      if (error) {
        return res.send(error)
      }
      delete req.session.errorMessage;
      res.send(html);
    });
  },
  passwordReset: (req, res) => {
    res.render('user/forgot_password', { errorMessage: req.session.errorMessage, logged: req.session.isUserAuth }, (error, html) => {
      if (error) {
        res.send(error.message)
      }

      delete req.session.errorMessage
      res.send(html)
    });
  },
  emailverify: (req, res) => {

    res.render('user/email_verification', { registerdEmail: req.session.useremail, errorMessage: req.session.errorMessage, logged: req.session.isUserAuth }, (error, html) => {
      if (error) {
        res.send(error.message)
      }
      delete req.session.useremail
      delete req.session.errorMessage
      res.send(html)
    });
  },
  resetPassword: (req, res) => {
    res.render('user/reset_password', { registerdEmail: req.session.useremail, errorMessage: req.session.errorMessage, logged: req.session.isUserAuth }, (error, html) => {
      if (error) {
        res.send(error.message)
      }
      delete req.session.useremail
      delete req.session.errorMessage
      res.send(html)
    });
  },
  singleProduct: async (req, res, next) => {
    const userId = req.session.userId
    const query = queryString.stringify(req.query);
    const { pid } = req.query
    const review = await ReviewHelper.productReview(userId, pid);
    const isPurchased = await OrderHelper.userPurchased(userId, pid);

    axios.all([
      axios.get(`http://localhost:${process.env.PORT}/api/singleEditProduct?userId=${userId}&${query}`),
      axios.get(`http://localhost:${process.env.PORT}/api/categories`)
    ])
      .then(axios.spread((productResponse, categoriesResponse) => {
        const products = productResponse.data.result;
        const categories = categoriesResponse.data;
        const selected = productResponse.data.selected;

        res.status(200).render('user/singleProduct', { logged: req.session.isUserAuth, products: products.existingProduct, isCart: products.isCart, categories, selected: selected, review: review, isPurchased: isPurchased })
      }))
      .catch((error) => {
        // console.error('Error in adminEditProduct:', error);
        // res.status(500).send('Internal Server Error');
        next(error)

      });

  },
  productListPage: (req, res) => {

    const query = queryString.stringify(req.query);

    axios.all([
      axios.get(`http://localhost:${process.env.PORT}/api/allProducts?${query}`),
      axios.get(`http://localhost:${process.env.PORT}/api/categories`)
    ])
      .then(axios.spread((productResponse, categoriesResponse) => {
        const products = productResponse.data.products;
        const categories = categoriesResponse.data;
        const totalPages = productResponse.data.totalPages;
        const brands = productResponse.data.brands;
        const caseDiameters = productResponse.data.caseDiameters;
        const selected = productResponse.data.selected;

        res.status(200).render('user/productList', { logged: req.session.isUserAuth, products, categories, totalPages, brands, caseDiameters, selected })

      }))
      .catch((error) => {
        res.status(500).send('Internal Server Error');
      });

  },
  userProfile: (req, res) => {
    const userEmail = req.session.email
    axios.all([
      axios.get(`http://localhost:${process.env.PORT}/api/categories`),
      axios.get(`http://localhost:${process.env.PORT}/api/getUserInfo?userEmail=${userEmail}`)
    ])
      .then(axios.spread((categoriesResponse, userResponse) => {
        const categories = categoriesResponse.data;
        const singleUser = userResponse.data

        res.status(200).render('user/userProfile', { categories: categories, user: singleUser, logged: req.session.isUserAuth })
      }))
      .catch((error => {
        console.error('Error in userproduct pag:', error.message);
        res.status(500).send('Internal Server Error');
      }))

  },
  userAddress: async (req, res) => {
    const { addressId } = req.session
    const categories = await categoryHelper.allCategory()
    const allStates = await statesHelper.allStates();
    const allAddress = await addressHelper.userAddress(addressId);

    res.status(200).render('user/userAddress',
      {
        address: allAddress,
        logged: req.session.isUserAuth,
        categories: categories,
        allStates: allStates
      }
    )

  },
  editAddress: async (req, res, next) => {
    try {
      const addressId = req.session.addressId;
      const { selected } = req.query
      const categories = await categoryHelper.allCategory()
      const allStates = await statesHelper.allStates();
      axios.all([
        axios.get(`http://localhost:${process.env.PORT}/api/userEditAddress/${addressId}?selected=${selected}`)
      ])
        .then(axios.spread((addressResponse) => {
          const address = addressResponse.data;
          res.status(200).render('user/userEditAddress',
            {
              logged: req.session.isUserAuth,
              categories: categories,
              address: address,
              allStates: allStates
            }
          )


        }))
        .catch(error => {
          res.status(500).send(error.message)
        })
    } catch (error) {
      next(error)
    }
  },

  cart: (req, res) => {
    const userId = req.session.userId;
    axios.all([
      axios.get(`http://localhost:${process.env.PORT}/api/categories`),
      axios.get(`http://localhost:${process.env.PORT}/api/getUserCart/${userId}`)
    ])

      .then(axios.spread((categoryResponse, cartResponse) => {
        const categories = categoryResponse.data;
        const cart = cartResponse.data;
        res.status(200).render('user/cart', { categories: categories, cart: cart, logged: req.session.isUserAuth })
      }))

      .catch((error) => {
        res.status(500).send(error.message)
      })


  },
  checkoutPage: async (req, res, next) => {
    const { userId, addressId } = req.session;
    const coupen = await coupenHelper.getAllCoupon();
    const categories = await categoryHelper.allCategory();
    const allAddress = await addressHelper.userAddress(addressId);
    const allStates = await statesHelper.allStates();
    const [userWallet] = await Wallet.userWallet(userId)
    let walletId = null;
    let balance = 0;
    if (userWallet) ({ _id: walletId, balance } = userWallet);

    let address = {};
    if (allAddress.length > 0) {
      address.defaultAddress = allAddress.find(data => data.address.defaultAdress);
      address.otherAddresses = allAddress.filter(data => !data.address.defaultAdress);
    } else {
      address = undefined
    }
    axios.all([
      axios.get(`http://localhost:${process.env.PORT}/api/getUserCart/${userId}`)
    ])

      .then(axios.spread((cartResponse) => {


        const cartItems = cartResponse.data;
 
        res.status(200).render('user/checkout',
          {
            categories: categories,
            logged: req.session.isUserAuth,
            address: address,
            cartItems: cartItems,
            allStates: allStates,
            coupon: coupen,
            wallet: {
              walletId,
              balance
            }

          },
          (error, html) => {

            if (error) {
              return res.send(error)
            }
            delete req.session.coupon;
            res.send(html);

          })
      }))

      .catch((error) => {
        next(error)
      })

  },
  orderHistory: async (req, res, next) => {
    try {
      const query = queryString.stringify(req.query);
      const { userId } = req.session;
      const categories = categoryHelper.allCategory()
 
      const orderResponse= await axios.get(`http://localhost:${process.env.PORT}/api/getUserOrder/${userId}?${query}`)
      const { orders, totalPages, selected } = orderResponse.data;
      res.status(200).render('user/orderHistory', {
        logged: req.session.isUserAuth,
        orders,
        categories,
        totalPages,
        selected,
      });
    } catch (error) {
      next(error);
    }
  },

  ordersingle: async (req, res, next) => {
    try {
      const { soid } = req.query;
      const [orderSingle] = await OrderHelper.getSingleOrder(soid);
      const categories = await categoryHelper.allCategory()
      res.status(200).render('user/orderSingle',
        {
          logged: req.session.isUserAuth,
          categories: categories,
          order: orderSingle
        }
      )
    }
    catch (error) {
      next(error)
    }
  },
  orderSuccess: async (req, res, next) => {
    try {
      const categories = await categoryHelper.allCategory()
      res.status(200).render('user/orderSuccess',
        {
          logged: req.session.isUserAuth,
          categories: categories
        },
        (error, html) => {
          if (error) {
            return res.send(error)
          }
          delete req.session.isOrder;
          res.send(html);
        })
    } catch (error) {
      next(error)
    }

  },
  wallet: async (req, res) => {
    const { userId } = req.session;
    const [wallet] = await Wallet.userWallet(userId);
    axios.all([
      axios.get(`http://localhost:${process.env.PORT}/api/categories`),

    ])
      .then(axios.spread((categoryResponse) => {
        const categories = categoryResponse.data
        res.status(200).render('user/userWallet', { logged: req.session.isUserAuth, categories: categories, wallet: wallet }, (error, html) => {
          if (error) {
            return res.send(error)
          }
          res.send(html);

        })
      }))
      .catch((error) => {
        res.status(500).send(error.message)
      })

  }


}
