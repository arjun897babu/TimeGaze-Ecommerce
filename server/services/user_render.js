const axios = require('axios');
const { response } = require('express');


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

    const { productId } = req.query;
    console.log(productId);

    axios.all([
      axios.get(`http://localhost:${process.env.PORT}/api/singleEditProduct?productId=${productId}`),
      axios.get(`http://localhost:${process.env.PORT}/api/categories`)
    ])
      .then(axios.spread((productResponse, categoriesResponse) => {
        const products = productResponse.data;
        const categories = categoriesResponse.data;
        console.log(products, categories)

        res.status(200).render('user/singleProduct', { logged: req.session.isUserAuth, products, categories })
      }))
      .catch((error) => {
        console.error('Error in adminEditProduct:', error.message);
        res.status(500).send('Internal Server Error');
      });

  },
  productListPage: (req, res) => {
    const categoryId = req.query.categoryId;
    console.log('after api',categoryId)
    axios.all([
      axios.get(`http://localhost:${process.env.PORT}/api/productList?categoryId=${categoryId}`),
      axios.get(`http://localhost:${process.env.PORT}/api/categories`)
    ])
      .then(axios.spread((productResponse, categoriesResponse) => {
        const products = productResponse.data;
        const categories = categoriesResponse.data;
        console.log( products, categories)
        res.status(200).render('user/productList', { logged: req.session.isUserAuth, products, categories })
        
      }))
      .catch((error) => {
        console.error('Error in userproduct pag:', error.message);
        res.status(500).send('Internal Server Error');
      });
     
  },
  userProfile: (req, res) => {
    axios.get(`http://localhost:${process.env.PORT}/api/categories`)
      .then((response) => {
        res.status(200).render('user/userProfile', { categories: response.data, logged: req.session.isUserAuth })
      })
      .catch((error) => {
        res.status(500).send(error)
      })

  },
  userAddress: (req, res) => {
    console.log('before render', req.session.email);
    const userEmail = req.session.email
    axios.get(`http://localhost:${process.env.PORT}/api/getAddressDetails?userEmail=${userEmail}`)
      .then((response) => {
        const allAddress = response.data
        console.log('response axios', response.data)

        res.status(200).render('user/userAddress', { address: allAddress, logged: req.session.isUserAuth, categories: response.data })
      })
      .catch((error)=>{
        res.status(500).send(error.message)
      })

  },
  errorPage: (req, res) => {
    res.status(404).render('error')
  }
}

