const adminServices = require('../services/admin_render');
const adminControll = require('../controller/admin');
const productControll = require('../controller/product');
const cateogryControll = require('../controller/category')
const adminMiddleWare = require('../middlewares/admin/admin');
const imageUpload = require('../middlewares/admin/multerMIddleWare')

const express = require('express');
const adminRoute = express.Router();

adminRoute.get('/adminHome', adminMiddleWare.isAdmin, adminServices.adminHome);//admin home
adminRoute.get('/adminLogin', adminMiddleWare.isNotAdmin, adminServices.adminLogin);//admin login
adminRoute.get('/adminproducts',  adminServices.adminproducts);//product detail page
adminRoute.get('/addproducts', adminServices.adminaddproducts);//product add page
adminRoute.get('/adminusers', adminMiddleWare.isAdmin, adminServices.adminusers);//list users on admin side
adminRoute.get('/adminCategory', adminMiddleWare.isAdmin, adminServices.adminCategory);//list categories on admin side
adminRoute.get('/addCategory', adminMiddleWare.isAdmin, adminServices.addCategory);//add categories
adminRoute.get('/updateCategory', adminMiddleWare.isAdmin, adminServices.updateCategory)//update category
adminRoute.get('/unlistedCategory', adminMiddleWare.isAdmin, adminServices.unlistedCategory)//unlisted categories
adminRoute.get('/unlistedProducts', adminMiddleWare.isAdmin, adminServices.unlistedProducts);//unlsited products
adminRoute.get('/updateProduct',  adminServices.adminEditProduct);//edit product


adminRoute.post('/api/adminLogin', adminControll.adminLogin);//for admin login 
adminRoute.post('/api/adminLogout', adminControll.adminLogout);//for admin logout


adminRoute.get('/api/users', adminControll.findAllUser);//to find the all users
adminRoute.put('/api/blockUser/:userId', adminControll.blockUser);//to block the user
adminRoute.put('/api/unblockUser/:userId', adminControll.unblockUser);//to unblock the user


adminRoute.post('/api/addCategory', cateogryControll.addCategory);//to add category
adminRoute.get('/api/categories', cateogryControll.findAllCategory);//to show the category
adminRoute.get('/api/unlistedCategory', cateogryControll.findUnlistedCategory);//unlisted the category
adminRoute.put('/api/deleteCategory/:categoryId', cateogryControll.deleteCategory);//to delete category
adminRoute.put('/api/restoreCategory/:categoryId', cateogryControll.restoreCategory);//to restore category
adminRoute.get('/api/singleEditCategory', cateogryControll.singleCategory);//to render the editcategory page with deatails
adminRoute.put('/api/updateCategory/:categoryId', cateogryControll.updateCategory);// to updateCategory


adminRoute.post('/api/addProduct', imageUpload.upload.array('images', 4), productControll.addProducts);//to add product
adminRoute.get('/api/allProducts', productControll.allProducts)//to show all the product
adminRoute.put('/api/deleteProduct/:productId', productControll.deleteProducts);//for deleting the product
adminRoute.put('/api/restoreProduct/:productId', productControll.restoreProducts);//for restoring the deleted product
adminRoute.get('/api/unlistedProduct', productControll.unlistedProducts);//to show the unlisted product
adminRoute.get('/api/singleEditProduct', productControll.singleProduct);//to get a single product detal
adminRoute.patch('/api/deleteImage/:productId',productControll.delteImage);//
adminRoute.put('/api/updareProduct/:productId',imageUpload.upload.array('images',4), productControll.updateProducts);//update product;

// adminRoute.get("*",adminServices.errorPage);

module.exports = adminRoute;

