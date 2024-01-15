const axios = require('axios');
const { error } = require('console');
const queryString = require('querystring')
// const { response } = require('express');


module.exports = {
  home: (req, res) => {

    const { query } = req.query;
    console.log(query);
    axios.all([
      axios.get(`http://localhost:${process.env.PORT}/api/allProducts`),
      axios.get(`http://localhost:${process.env.PORT}/api/categories`)
    ])
      .then(axios.spread((productResponse, categoriesResponse) => {
        const products = productResponse.data.products;
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
    res.render('user/user_signup', { errorMessage: req.session.errorMessage, logged: req.session.isUserAuth },(error,html)=>{
      if (error) {
        return res.send(error)
      }
      delete req.session.invalidMessage;
      res.send(html);
    });
  },
  emailverify: (req, res) => {

    res.render('user/email_verification', { registerdEmail: req.session.useremail, errorMessage: req.session.errorMessage, logged: req.session.isUserAuth }, (error, html) => {
      if (error) {
        res.send(error.message)
      }
      // delete req.session.useremail
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
  singleProduct: (req, res,next) => { 
    const userId = req.session.userId
    const query = queryString.stringify(req.query);


    axios.all([
      axios.get(`http://localhost:${process.env.PORT}/api/singleEditProduct?userId=${userId}&${query}`),
      axios.get(`http://localhost:${process.env.PORT}/api/categories`)
    ])
      .then(axios.spread((productResponse, categoriesResponse) => {
        const products = productResponse.data.result;
        const categories = categoriesResponse.data;
        

        res.status(200).render('user/singleProduct', { logged: req.session.isUserAuth, products: products.existingProduct, isCart: products.isCart, categories })
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
        console.log(caseDiameters)
     
        res.status(200).render('user/productList', { logged: req.session.isUserAuth, products, categories, totalPages,brands,caseDiameters,selected })

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
        const allAddress = addressResponse.data.address
        const allStates = addressResponse.data.allStates
        const categories = categoryResponse.data
        res.status(200).render('user/userAddress', { address: allAddress, logged: req.session.isUserAuth, categories: categories,allStates:allStates })
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
        console.log('sss',address)
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
    console.log(req.originalUrl)
    const userEmail = req.session.email;
    const userId = req.session.userId;
    axios.all([
      axios.get(`http://localhost:${process.env.PORT}/api/categories`),
      axios.get(`http://localhost:${process.env.PORT}/api/getAddressDetails?userEmail=${userEmail}`),
      axios.get(`http://localhost:${process.env.PORT}/api/getUserCart/${userId}`)
    ])

      .then(axios.spread((categoryResponse, addressResponse, cartResponse) => {
        const categories = categoryResponse.data;
        const addressData = addressResponse.data.address;
        const allStates = addressResponse.data.allStates


        const address = {
          defaultAddress: addressData.find(data => data.address.defaultAdress),
          otherAddresses: addressData.filter(data => !data.address.defaultAdress),
        };

        const cartItems = cartResponse.data;


        res.status(200).render('user/checkout', { categories: categories, logged: req.session.isUserAuth, address: address, cartItems: cartItems,allStates:allStates  })
      }))

      .catch((error) => {
        res.status(500).send(error.message)
      })

  },
  orderHistory: (req, res) => {
    const { userId } = req.session
    axios.all([
      axios.get(`http://localhost:${process.env.PORT}/api/categories`),
      axios.get(`http://localhost:${process.env.PORT}/api/getUserOrder/${userId}`)
    ])
      .then(axios.spread((categoryResponse, orderResponse) => {

        const categories = categoryResponse.data;
        const orders = orderResponse.data;
        console.log(orders)
        res.status(200).render('user/orderHistory', { logged: req.session.isUserAuth, order: orders, categories: categories })
      }))
      .catch((error) => {
        console.log(error)
        res.status(500).send(error.message)
      })
    },
    ordersingle: (req, res) => {
      const { userId } = req.session
      const {soid} = req.query;
      axios.all([
        axios.get(`http://localhost:${process.env.PORT}/api/categories`),
        axios.get(`http://localhost:${process.env.PORT}/api/getSingleOrder/${soid}`),
        
    ])
      .then(axios.spread((categoryResponse,orderResponse) => {

        const categories = categoryResponse.data
        const order = orderResponse.data;
        console.log('dddddd',order)
        res.status(200).render('user/ordersingle', { logged: req.session.isUserAuth, categories: categories,order:order })
      }))
      .catch((error) => {
        console.log(error)
        res.status(500).send(error.message)
      })
  },
  orderSuccess: (req, res) => {
    const { userId } = req.session;
    axios.all([
      axios.get(`http://localhost:${process.env.PORT}/api/categories`),

    ])
      .then(axios.spread((categoryResponse) => {
        const categories = categoryResponse.data
       
        res.status(200).render('user/orderSuccess', { logged: req.session.isUserAuth, categories: categories }, (error, html) => {
          if (error) {
            return res.send(error)
          }

          delete req.session.isOrder;
          res.send(html);

        })
      }))
      .catch((error) => {
        console.log(error)
        res.status(500).send(error.message)
      })

  },


}

