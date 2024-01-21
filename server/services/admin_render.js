const axios = require('axios');
const { response } = require('express');
require('dotenv').config();
const queryString = require('querystring');
const coupenHelper = require('../utilities/coupen');

module.exports = {

  adminLogin: (req, res) => {

    res.render('admin/adminLogin', { errorMessage: req.session.errorMessage }, (error, html) => {
      if (error) {
        res.send(error)
      }
      delete req.session.errorMessage;
      res.status(200).send(html)
    });
  },

  adminHome: (req, res) => {


    res.render('admin/adminHome')
  },

  adminproducts: (req, res) => {

    const query = queryString.stringify(req.query);

    axios.get(`http://localhost:${process.env.PORT}/api/allProducts?${query}`)
      .then((productResponse) => {
        const products = productResponse.data.products;
        const totalPages = productResponse.data.totalPages;
        console.log(totalPages)

        res.status(200).render('admin/adminproducts', { products, totalPages })
      })
      .catch((error) => {
        res.status(500).send(error.message)
      })
  },

  adminaddproducts: (req, res) => {

    axios.get(`http://localhost:${process.env.PORT}/api/categories`)
      .then((response) => {

        console.log('dd', req.session.errorMessage)
        res.status(200).render('admin/addproduct', { categories: response.data, errorMessage: req.session.errorMessage }, (error, html) => {
          if (error) {
            res.send(error.message)
          }
          delete req.session.errorMessage;
          res.status(200).send(html)
        })
      })
      .catch((error) => {
        res.status(500).send(error)
      })

  },

  adminEditProduct: (req, res) => {
    const { product } = req.query;
    const query = queryString.stringify(req.query);

    axios.all([
      axios.get(`http://localhost:${process.env.PORT}/api/singleEditProduct?${query}`),
      axios.get(`http://localhost:${process.env.PORT}/api/categories`)
    ])
      .then(axios.spread((productResponse, categoriesResponse) => {
        const products = productResponse.data.result;
        const categories = categoriesResponse.data;

        res.status(200).render('admin/editproduct', { products: products.existingProduct, categories });
      }))
      .catch((error) => {
        console.error('Error in adminEditProduct:', error.message);
        res.status(500).send('Internal Server Error');
      });
  },

  adminusers: (req, res) => {
    axios.get(`http://localhost:${process.env.PORT}/api/users`)
      .then((response) => {
        res.status(200).render('admin/adminusers', { users: response.data })
      }).catch((error) => {
        res.status(500).send(error)
      })
  },

  adminCategory: (req, res) => {
    axios.get(`http://localhost:${process.env.PORT}/api/categories`)
      .then((response) => {
        res.status(200).render('admin/adminCategory', { categories: response.data })
      })
      .catch((error) => {
        res.status(500).send(error)
      })


  },

  addCategory: (req, res) => {
    res.status(200).render('admin/adminAddCategory', { errorMessage: req.session.errorMessage }, (error, html) => {
      if (error) {
        res.send(error.message)
      }

      delete req.session.errorMessage;
      res.send(html);

    });
  },
  updateCategory: (req, res) => {
    const { categoryId } = req.query

    axios.get(`http://localhost:${process.env.PORT}/api/singleEditCategory?categoryId=${categoryId}`)
      .then((response) => {
        res.status(200).render('admin/adminEditCategory', { categories: response.data });
      })
      .catch((error) => {
        res.send(error.message)
      })

  },

  unlistedCategory: (req, res) => {
    axios.get(`http://localhost:${process.env.PORT}/api/unlistedCategory`)
      .then((response) => {
        res.status(200).render('admin/unlistedCategories', { categories: response.data })
      })
      .catch(error => {
        res.send(error.message)
      })
  },

  unlistedProducts: (req, res) => {
    axios.get(`http://localhost:${process.env.PORT}/api/unlistedProduct`)
      .then((response) => {
        res.status(200).render('admin/unlistedProduct', { products: response.data })
      })
      .catch(error => {
        res.send(error.message)
      })
  },
  order: (req, res) => {
    axios.get(`http://localhost:${process.env.PORT}/api/getAllOrder`)
      .then((response) => {
        const order = response.data;
        console.log(order)
        res.status(200).render('admin/adminOrder', { orders: order })
      })
      .catch(error => {
        res.send(error.message)
      })

  },
  coupen: async(req, res, next) => {
    const coupen = await coupenHelper.getAllCoupon();
    console.log(coupen)
    res.status(200).render('admin/adminCoupen',{coupon:coupen})
  },

  errorPage: (req, res) => {
    res.status(404).render('error')
  }
}