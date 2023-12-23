const { default: mongoose } = require('mongoose');
const category = require('../model/categorySchema');
const Product = require('../model/productSchema');

const fs = require('fs')


//to add products
exports.addProducts = async (req, res) => {
  try {
    const { name, brand, diameter, shape, price, offer, discountPrice, category, quantity } = req.body;
    console.log(req.body);
    console.log(name, brand, diameter, shape, price, offer, category, quantity);
    if (!name || !brand || !diameter || !shape || !price || !offer || !discountPrice || !category || !quantity) {
      return res.send('all fields are required')
    };
    console.log(req.files)
    const images = req.files.map((file) => { return file.filename });
    console.log(images)
    if (!images) {
      return res.status(400).redirect('/addproducts')
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
    console.log(addProduct)
    if (addProduct) {

      console.log('product saved successfully');
      res.status(200).redirect('/adminproducts')
    } else {
      res.send('some error occured')
    }

  } catch (error) {
    res.status(500).send(error.message)
  }
}

//updateProduct
exports.updateProducts = async (req, res) => {
  try {
    const { productId } = req.params;

    const { name, brand, diameter, shape, price, offer, discountPrice, category, quantity } = req.body;

    const images = req.files.map((file) => { return file.filename });

    if (!name || !brand || !diameter || !shape || !price || !offer || !discountPrice || !category || !quantity) {
      return res.status(400).send('all fields are required')
    };

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

      res.status(200).send(updateProduct)
    } else {
      res.status(400).send('some error occured')
    }

  } catch (error) {
    res.status(500).send(error.message)
  }
}


//find all product

exports.allProducts = async (req, res) => {

  try {
    const products = await Product.find(
      {
        unlisted: false
      })
      .populate('category');

    res.send(products);

  } catch (error) {
    res.send(error.message);

  }

}

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
    res.send(error.message);

  }
}


//delete products

exports.deleteProducts = async (req, res) => {
  try {
    const { productId } = req.params;
    console.log(productId)

    const existingProduct = await Product.findByIdAndUpdate(productId, { unlisted: true }, { new: true });

    if (existingProduct) {
      console.log(existingCateogry);
      res.status(200).send('delted')
    } else {
      res.status(400).send('not found')
    }
  }
  catch (error) {
    res.send(error.message)
  }
}


//restore product 

exports.restoreProducts = async (req, res) => {
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

//to get a single details of product 

exports.singleProduct = async (req, res) => {

  try {
    const { productId } = req.query;
    console.log(productId);
    if (!productId) {
      return res.send('all fields are required');
    }
    const existingProduct = await Product.findOne({ _id: productId }).populate('category')

    if (!existingProduct) {
      res.send('no product found')
    } else {
      console.log(existingProduct);
      res.send(existingProduct)
    }
  }

  catch (error) {
    console.log(error.message)
    res.send(error.message)
  }
}

//delete product image


exports.delteImage = async (req, res) => {
  try {
    const { productId } = req.params;
    const { imageName } = req.body;

    console.log('Request Params:', req.params);
    console.log('Request Body:', req.body);

    if (!productId || !imageName) {
      return res.status(400).send('All fields are required');
    }

    fs.unlink(`public/uploads/${imageName}`, (err) => {
      if (err) throw err;
      // File has been deleted successfully
    });

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
    console.log(dbDeletedImage)
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

exports.productListOnUser = async (req, res) => {
  try {
    const categoryId = req.query.categoryId;
    console.log('categoyId', categoryId)

    const existingCateogry = await category.findOne({ _id: categoryId, unlisted: false });

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