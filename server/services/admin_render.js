const axios = require('axios');
const { response } = require('express');
require('dotenv').config();
const queryString = require('querystring');
const coupenHelper = require('../utilities/coupen');
const userHelper = require('../utilities/user');
const orderHelper = require('../utilities/order');
const categoryHelper = require('../utilities/category');
const ProductHelper = require('../utilities/product');
const OfferHelper = require('../utilities/offer');


module.exports = {

  adminLogin: (req, res) => {

    res.render('admin/adminLogin',
      {
        errorMessage: req.session.errorMessage,
      },
      (error, html) => {
        if (error) {
          res.send(error)
        }
        delete req.session.errorMessage;
        res.status(200).send(html)
      });
  },

  adminHome: async (req, res, next) => {
    try {
      const user = await userHelper.userCount();
      const order = await orderHelper.profitAndOrder();
      res.render('admin/adminHome',
        {
          user: user,
          order: order,
          noOrder: req.session.noOrder
        },
        (error, html) => {
          if (error) {
            return next(error)
          }
          delete req.session.noOrder
          res.send(html)
        }
      )
    }
    catch (error) {
      next(error)
    }

  },

  adminproducts: async (req, res, next) => {
    try {

      const query = queryString.stringify(req.query);
      const categories = await categoryHelper.allCategory()
      axios.get(`http://localhost:${process.env.PORT}/api/allProducts?${query}`)
        .then((productResponse) => {
          const products = productResponse.data.products;
          const totalPages = productResponse.data.totalPages;
          const selected = productResponse.data.selected;
          res.status(200).render('admin/adminproducts',
            {
              products,
              totalPages,
              categories,
              selected
            }
          )
        })
        .catch((error) => {
          res.status(500).send(error.message)
        })
    }
    catch (error) {
      next(error)
    }
  },

  adminaddproducts: (req, res) => {

    axios.get(`http://localhost:${process.env.PORT}/api/categories`)
      .then((response) => {

        res.status(200).render('admin/addproduct',
          {
            categories: response.data,
            errorMessage: req.session.errorMessage
          },
          (error, html) => {
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

  adminusers: async (req, res, next) => {
    try {
      const {
        users, totalPages, selected
      } = await userHelper.findAlluser(req)

      res.status(200).render('admin/adminusers',
        {
          users,
          totalPages,
          selected
        }
      )
    } catch (error) {
      next(error)
    }
   
  },

  adminCategory: async (req, res, next) => {
    try {
      const {
        categories, totalPages, selected
      } = await categoryHelper.categoriesWithPagination(req);
      console.log(categories, totalPages, selected)
      res.status(200).render('admin/adminCategory',
        {
          categories,
          totalPages,
          selected
        }
      )
    } catch (error) {
      next(error);
    }

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
    const query = queryString.stringify(req.query)
    axios.get(`http://localhost:${process.env.PORT}/api/getAllOrder?${query}`)
      .then((response) => {

        const {
          orders, totalPages, selected
        } = response.data;
        res.status(200).render('admin/adminOrder',
          {
            orders,
            totalPages,
            selected
          }
        )
      })
      .catch(error => {
        res.send(error.message)
      })

  },
  coupen: async (req, res, next) => {
    try {
      const {
        coupon, totalPages, selected
      } = await coupenHelper.couponWithPagination(req);
      res.status(200).render('admin/adminCoupen',
        {
          coupon,
          totalPages,
          selected
        }
      )
    } catch (error) {
      next(error)
    }
  },
  offer: async (req, res, next) => {
    try {
      const {
        offers, totalPages, selected
      } = await OfferHelper.offerWithPagination(req);

      res.status(200).render('admin/adminOffer',
        {
          offers,
          totalPages,
          selected,
          successMessage: req.session.successMessage
        },
        (error, html) => {
          if (error) {
            return next(error)
          }

          delete req.session.successMessage
          res.status(200).send(html)

        })

    } catch (error) {
      next(error)
    }
  }
  ,
  addOffer: async (req, res, next) => {
    try {
      const categories = await categoryHelper.allCategory();
      const product = await ProductHelper.allProduct()
      res.status(200).render('admin/addOffer',
        {
          categories: categories,
          products: product,
          errorMessage: req.session.errorMessage,
        },
        (error, html) => {
          if (error) {
            return next(error)
          }

          delete req.session.errorMessage

          res.status(200).send(html)
        })
    }
    catch (error) {
      next(error)
    }
  }
  ,
  errorPage: (req, res) => {
    res.status(404).render('error')
  }
}