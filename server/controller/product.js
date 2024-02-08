const { default: mongoose } = require('mongoose');
const category = require('../model/categorySchema');
const Product = require('../model/productSchema');
const Cart = require('../model/cartSchema');
const queryString = require('querystring');
const fs = require('fs');

//to add products
exports.addProducts = async (req, res, next) => {
  try {

    const { name, brand, diameter, shape, price, offer, discountPrice, category, quantity } = req.body;
    console.log(req.body);
    console.log(name, brand, diameter, shape, price, offer, category, quantity);
    if (!name || !brand || !diameter || !shape || !price || !offer || !category || !quantity) {
      return res.send('all fields are required')
    };

    const existingProduct = await Product.exists({ productName: { $regex: `^${name}[0-9]*$`, $options: 'i' } });
    let errorMessage = {};

    if (existingProduct) {
      errorMessage.name = 'Product already exists';
      req.session.errorMessage = errorMessage;
      return res.status(400).redirect('/addproducts');
    }

    const images = req.files.map((file) => { return file.filename });

    if (!images) {
      return res.status(400).redirect('/addproducts');
    }

    const newProduct = new Product({
      productName: name,
      brand: brand,
      caseDiameter: diameter,
      caseShape: shape,
      price: price,
      offer: offer,
      discountPrice: discountPrice,
      category: category,
      quantity: quantity,
      image: images

    });

    const addProduct = await newProduct.save();

    if (addProduct) {
      res.status(200).redirect('/adminproducts')
    }
  } catch (error) {
    next(error)
  }
}

//updateProduct
exports.updateProducts = async (req, res, next) => {
  try {
    const { productId } = req.params;
    console.log(productId)

    const { name, brand, diameter, shape, price, offer, discountPrice, category, quantity } = req.body;

    const images = req.files.map((file) => { return file.filename });

    if (!name || !brand || !diameter || !shape || !price || !offer || !discountPrice || !category || !quantity) {
      return res.status(400).send('all fields are required')
    };
    const existingProduct = await Product.exists({
      _id: { $ne: productId },
      productName: { $regex: `^${name}[0-9]*$`, $options: 'i' }
    });
    console.log(existingProduct)

    if (existingProduct) {
      return res.status(409).json({ error: 'Product already exists' });
    }


    if (!images) {
      return res.send('please upload images')
    }

    const newDetails = ({
      productName: name,
      brand: brand,
      caseDiameter: diameter,
      caseShape: shape,
      price: price,
      offer: offer,
      discountPrice: discountPrice,
      category: category,
      quantity: quantity

    });


    const updateProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $set:
          newDetails,
        $push:
        {
          image: images
        }
      },
      {
        new: true
      })


    if (updateProduct) {

      res.status(200).json({ updateProduct })
    } else {
      res.status(400).send('some error occured')
    }

  } catch (error) {
    res.status(500).send(error.message)
  }
}


//find all product

exports.allProducts = async (req, res, next) => {
  try {

    let { pageNumber = 1, category, brand, caseDiameter, search, sort=1} = req.query;

    if (!req.query.hasOwnProperty('pageNumber') || req.query.pageNumber === '' || req.query.pageNumber < 1) {
      req.query.pageNumber = 1;
      pageNumber = 1
    }
    const perPage = 4;
    const startIndex = Math.ceil((pageNumber - 1) * perPage);
    const endIndex = Math.ceil(startIndex + perPage);

    let matchQuery = {
      unlisted: false,
      'category.unlisted': false,
    };
    let brandQuery = { $match: {} }
    let caseDiameterQuery = { $match: {} }
    let selected = {};


    if (category || brand || caseDiameter || search) {

      if (category) {

        const categories = category.split(',')
          .map(cat => (
            {
              'category.categoryName': {
                $regex: `^${cat.trim()}$`,
                $options: 'i'
              }
            }
          )
          );

        selected.category = category.split(',')
        matchQuery.$or = categories
      }

      if (brand) {

        const brands = brand.split(',')
          .map(b => (
            {
              brand: {
                $regex: `^${b.trim()}$`,
                $options: 'i'
              }
            }
          )
          );

        selected.brands = brand.split(',')
        brandQuery.$match.$or = brands;
      }
      if (caseDiameter) {
        const caseDiameters = caseDiameter.split(',')
          .map(caseD => (
            {
              caseDiameter: Number(caseD)
            }
          )
          );

        selected.caseDiameter = caseDiameter.split(',')
        caseDiameterQuery.$match.$or = caseDiameters;
      };
      if (search) {
        matchQuery.$or = [];
        matchQuery.$or = [
          {
            'category.categoryName': {
              $regex: search.trim(),
              $options: 'i'
            }
          },
          {
            brand: {
              $regex: search.trim(),
              $options: 'i'
            }
          },
          {
            productName:
            {
              $regex: search.trim(),
              $options: 'i'
            }
          }
        ];
        selected.search = search
      }
    }
    const productQuery = [
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      { $match: matchQuery },
      { ...brandQuery },
      { ...caseDiameterQuery },
      {
        $unwind: {
          path: '$categoryOffer',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$productOffer',
          preserveNullAndEmptyArrays: true
        }
      },
      {$sort:{discountPrice:sort}}


    ];
    // return res.json(productQuery)
    const filter = await Product.aggregate([
      
      {
        $group: {
          _id: null,
          brands: { $addToSet: "$brand" },
          caseDiameters: { $addToSet: "$caseDiameter" }
        }
      },
      {
        $project: {
          _id: 0,
          brands: { $sortArray: { input: "$brands", sortBy: 1 } },
          caseDiameters: { $sortArray: { input: "$caseDiameters", sortBy: 1 } }
        }
      }

    ])

    const [products, count] = await Promise.all([
      Product.aggregate([...productQuery, { $skip: startIndex }, { $limit: perPage }]),
      Product.aggregate([...productQuery, { $count: 'totalCount' }]),
      
    ]);
    
    const totalCount = count.length > 0 ? count[0].totalCount : 0;
    const totalPages = Math.ceil(totalCount / perPage);
    const path = queryString.stringify(req.query);

    return res.status(200).json({
      products,
      totalPages: {
        startIndex,
        endIndex,
        pageNumber,
        totalPages,
        path,
      },
      brands: filter[0].brands,
      caseDiameters: filter[0].caseDiameters,
      selected
    });
  } catch (error) {
    next(error);
  }
};



//unlisted products
exports.unlistedProducts = async (req, res) => {

  try {
    const products = await Product.find(
      {
        unlisted: true
      })
      .populate('category');

    res.send(products)

  } catch (error) {
    next(error)
  }
}


//delete products

exports.deleteProducts = async (req, res, next) => {
  try {
    const { productId } = req.params;
    console.log(productId)

    const existingProduct = await Product.findByIdAndUpdate(productId, { unlisted: true }, { new: true }).populate('category');
    console.log(existingProduct)
    if (existingProduct) {
      res.status(200).json({ status: 'success', product: existingProduct });
    } else {
      res.status(400).send('not found')
    }
  }
  catch (error) {
    res.send(error.message)
  }
}


//restore product 

exports.restoreProducts = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const existingProduct = await Product.findByIdAndUpdate(productId, { unlisted: false }, { new: true });

    if (existingProduct) {
      console.log(existingCateogry);
      res.status(200).send('restored')
    } else {
      res.status(400).send('not found')
    }
  }
  catch (error) {
    res.send(error.message)
  }
}



exports.singleProduct = async (req, res, next) => {
  try {
    let isCart = false;
    console.log(req.query);

    if (!req.query.hasOwnProperty('userId') || req.query.userId === '' || req.query.userId === 'undefined') {
      req.query.userId = undefined;
    }

    const { userId = '', pid = '', product = '' } = req.query;

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
      },
      {
        $unwind: {
          path: '$categoryOffer',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$productOffer',
          preserveNullAndEmptyArrays: true
        }
      },
    ]);



    if (userId) {
      if (existingProduct.length > 0) {
        const existsCartItem = await Cart.exists({
          userId: userId,
          'cartItem': {
            $elemMatch: { product: existingProduct[0]._id },
          },
        });

        if (existsCartItem) {
          isCart = true;
        }
      }
    }

    const result = {
      isCart: isCart,
      existingProduct: existingProduct
    };
    console.log(existingProduct)
    return res.status(200).json({ result: result });

  } catch (error) {
    console.log(error.message);
    next(error);

  }
};


//delete product image


exports.delteImage = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { imageName } = req.body;

    console.log('Request Params:', req.params);
    console.log('Request Body:', req.body);

    if (!productId || !imageName) {
      return res.status(400).send('All fields are required');
    }


    const dbDeletedImage = await Product.findByIdAndUpdate(
      productId,
      {
        $pull: {
          image: imageName
        }
      },
      {
        new: true
      }
    );

    if (dbDeletedImage) {
      res.status(200).send('Deleted from the server and database');
    } else {
      res.status(400).send('File does not exist');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error');
  }
};

exports.productListOnUser = async (req, res, next) => {
  try {
    const categoryId = req.query.categoryId;
    console.log('categoyId', categoryId);

    const existingCateogry = await category.findOne({ _id: categoryId, unlisted: false });
    console.log('existing category', existingCateogry)
    if (existingCateogry === null) {
      return res.send(null)
    }

    const products = await Product.aggregate(
      [
        {
          $match: { category: new mongoose.Types.ObjectId(categoryId), unlisted: false }
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category'
          }
        },

        { $unwind: '$category' }

      ]
    )
    console.log('loggin in fucntion', products)

    if (products.length > 0) {
      res.status(200).send(products);
    } else {
      res.send(false);
    }

  }
  catch (error) {
    res.status(500).send(error.message)
  }
}