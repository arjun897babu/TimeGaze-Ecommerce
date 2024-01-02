const axios = require('axios');
// const { response } = require('express');


module.exports = {
  home: (req, res) => {
    axios.all([
      axios.get(`http://localhost:${process.env.PORT}/api/allProducts`),
      axios.get(`http://localhost:${process.env.PORT}/api/categories`)
    ])
      .then(axios.spread((productResponse, categoriesResponse) => {
        const products = productResponse.data;
        const categories = categoriesResponse.data;
        console.log('prodcuts:', products, 'categories', categories)
        console.log(req.session.email);
        res.status(200).render('index', { logged: req.session.isUserAuth, products, categories });
      }))
      .catch((error) => {
        console.error('Error in adminEditProduct:', error.message);
        res.status(500).send('Internal Server Error');
      });

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
    res.render('user/user_signup', { errorMessage: req.session.errorMessage, logged: req.session.isUserAuth });
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
  passwordReset: (req, res) => {
    res.render('user/forgot_password', { errorMessage: req.session.errorMessage, logged: req.session.isUserAuth }, (error, html) => {
      if (error) {
        res.send(error.message)
      }

      delete req.session.errorMessage
      res.send(html)
    });
  },
  resetPassword: (req, res) => {
    console.log(req.session.useremail);
    res.render('user/reset_password', { registerdEmail: req.session.useremail, errorMessage: req.session.errorMessage, logged: req.session.isUserAuth }, (error, html) => {
      if (error) {
        res.send(error.message)
      }
      delete req.session.useremail
      delete req.session.errorMessage
      res.send(html)
    });
  },
  singleProduct: (req, res) => {
    const userId = req.session.userId
    console.log('this is axios:', userId)
    const { productId } = req.query;


    axios.all([
      axios.get(`http://localhost:${process.env.PORT}/api/singleEditProduct?productId=${productId}&userId=${userId}`),
      axios.get(`http://localhost:${process.env.PORT}/api/categories`)
    ])
      .then(axios.spread((productResponse, categoriesResponse) => {
        const products = productResponse.data;
        const categories = categoriesResponse.data;
        console.log(products, categories);


        res.status(200).render('user/singleProduct', { logged: req.session.isUserAuth, products: products.existingProduct, isCart: products.isCart, categories })
      }))
      .catch((error) => {
        console.error('Error in adminEditProduct:', error.message);
        res.status(500).send('Internal Server Error');
      });

  },
  productListPage: (req, res) => {
    const categoryId = req.query.categoryId;
    if (!categoryId) return res.redirect('/error')
    axios.all([
      axios.get(`http://localhost:${process.env.PORT}/api/productList?categoryId=${categoryId}`),
      axios.get(`http://localhost:${process.env.PORT}/api/categories`)
    ])
      .then(axios.spread((productResponse, categoriesResponse) => {
        const products = productResponse.data;
        const categories = categoriesResponse.data;
        console.log(products, categories)

        res.status(200).render('user/productList', { logged: req.session.isUserAuth, products, categories })

      }))
      .catch((error) => {
        console.error('Error in userproduct pag:', error.message);
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
  userAddress: (req, res) => {

    const userEmail = req.session.email
    axios.all([
      axios.get(`http://localhost:${process.env.PORT}/api/getAddressDetails?userEmail=${userEmail}`),
      axios.get(`http://localhost:${process.env.PORT}/api/categories`)
    ])
      .then(axios.spread((addressResponse, categoryResponse) => {
        const allAddress = addressResponse.data
        const categories = categoryResponse.data
        res.status(200).render('user/userAddress', { address: allAddress, logged: req.session.isUserAuth, categories: categories })
      }))
      .catch((error) => {
        console.log(error)
        res.status(500).send(error.message)
      })

  },
  editAddress: (req, res) => {
    const addressId = req.session.addressId;
    const { selected } = req.query
    console.log('axios', addressId, selected);

    axios.all([
      axios.get(`http://localhost:${process.env.PORT}/api/categories`),
      axios.get(`http://localhost:${process.env.PORT}/api/userEditAddress/${addressId}?selected=${selected}`)
    ])
      .then(axios.spread((categoryResponse, addressResponse) => {
        const allCategories = categoryResponse.data;
        const address = addressResponse.data;

        res.status(200).render('user/userEditAddress', { logged: req.session.isUserAuth, categories: allCategories, address: address })

      }))
      .catch(error => {
        res.status(500).send(error.message)
      })




  },

  cart: (req, res) => {
    const userId = req.session.userId;
    console.log(userId)
    axios.all([
      axios.get(`http://localhost:${process.env.PORT}/api/categories`),
      axios.get(`http://localhost:${process.env.PORT}/api/getUserCart/${userId}`)
    ])

      .then(axios.spread((categoryResponse, cartResponse) => {
        const categories = categoryResponse.data;
        const cart = cartResponse.data;
        console.log(categories, cart)
        res.status(200).render('user/cart', { categories: categories, cart: cart, logged: req.session.isUserAuth })
      }))

      .catch((error) => {
        res.status(500).send(error.message)
      })


  },
  checkoutPage: (req, res) => {
    const userEmail = req.session.email;
    const userId = req.session.userId;
    axios.all([
      axios.get(`http://localhost:${process.env.PORT}/api/categories`),
      axios.get(`http://localhost:${process.env.PORT}/api/getAddressDetails?userEmail=${userEmail}`),
      axios.get(`http://localhost:${process.env.PORT}/api/getUserCart/${userId}`)
    ])

      .then(axios.spread((categoryResponse, addressResponse, cartResponse) => {
        const categories = categoryResponse.data;
        const addressData = addressResponse.data;
        console.log(addressData)

        const address = {
          defaultAddress: addressData.find(data => data.address.defaultAdress),
          otherAddresses: addressData.filter(data => !data.address.defaultAdress),
        };

        const cartItems = cartResponse.data;
        console.log('checkout page is rendered');
        console.log(categories, address, cartItems);

        res.status(200).render('user/checkout', { categories: categories, logged: req.session.isUserAuth, address: address, cartItems: cartItems })
      }))

      .catch((error) => {
        res.status(500).send(error.message)
      })

  },
  orderHistory: (req, res) => {
    const {userId} = req.session
    axios.all([
      axios.get(`http://localhost:${process.env.PORT}/api/categories`),
      axios.get(`http://localhost:${process.env.PORT}/api/getUserOrder/${userId}`)
    ])
      .then(axios.spread((categoryResponse,orderResponse) => {

        const categories = categoryResponse.data;
        const orders = orderResponse.data;
        console.log(orders)
        res.status(200).render('user/orderHistory', { logged: req.session.isUserAuth,order:orders, categories: categories })
      }))
      .catch((error) => {
        console.log(error)
        res.status(500).send(error.message)
      })
  },
  ordersingle: (req, res) => {
    const {userId} = req.session
    axios.all([
      axios.get(`http://localhost:${process.env.PORT}/api/categories`),
     
    ])
      .then(axios.spread((categoryResponse) => {

        const categories = categoryResponse.data
        res.status(200).render('user/ordersingle', { logged: req.session.isUserAuth, categories: categories })
      }))
      .catch((error) => {
        console.log(error)
        res.status(500).send(error.message)
      })
  },

  errorPage: (req, res) => {
    res.status(404).render('error')
  }
}

