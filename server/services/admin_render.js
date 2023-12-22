const axios = require('axios');
const { response } = require('express');
require('dotenv').config();
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
    
    axios.get(`http://localhost:${process.env.PORT}/api/allProducts`)
      .then((response) => {
        res.render('admin/adminproducts', { products: response.data })
      })
      .catch((error) => {
        res.status(500).send(error.message)
      })
  },

  adminaddproducts: (req, res) => {

    axios.get(`http://localhost:${process.env.PORT}/api/categories`)
      .then((response) => {
        res.status(200).render('admin/addproduct', { categories: response.data })
      })
      .catch((error) => {
        res.status(500).send(error)
      })

  },

  adminEditProduct: (req, res) => {
    const { productId } = req.query;

    axios.all([
      axios.get(`http://localhost:${process.env.PORT}/api/singleEditProduct?productId=${productId}`),
      axios.get(`http://localhost:${process.env.PORT}/api/categories`)
    ])
      .then(axios.spread((productResponse, categoriesResponse) => {
        const products = productResponse.data;
        const categories = categoriesResponse.data;
        

        res.status(200).render('admin/editproduct', { products, categories });
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
  errorPage:(req,res)=>{
    res.status(404).render('error')
  }
}