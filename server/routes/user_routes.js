const services = require('../services/user_render');
const controller = require('../controller/user');
const userMiddleWare = require('../middlewares/user/user');
const addressController = require('../controller/adress');
const productController = require('../controller/product');
const cartController = require('../controller/cart');


const express = require('express');
const route = express.Router();

route.get('/', userMiddleWare.isBlocked, services.home);//home page
route.get('/login', userMiddleWare.isUser, services.login);//login page
route.get('/signup', userMiddleWare.isUser, services.signup);//signup page
route.get('/emailVerify', userMiddleWare.isUser, services.emailverify);//otp verification for email
route.get('/passwordReset', userMiddleWare.isUser, services.passwordReset);//send otp for resetting passowrd
route.get('/resetPassword', userMiddleWare.isUser, services.resetPassword);//resetting passowrd
route.get('/productList', userMiddleWare.isBlocked, services.productListPage)//product list page
route.get('/singleProduct', userMiddleWare.isBlocked, services.singleProduct);//single product page
route.get('/profile', userMiddleWare.isBlocked, services.userProfile)//user Profile Home Page
route.get('/address', userMiddleWare.isBlocked, services.userAddress)//user Adress page
route.get('/cart', userMiddleWare.isBlocked, services.cart)//user cart
route.get('/editAddress',services.editAddress);//user edit Address page


route.post('/api/users', controller.createUser);//api for register a usr
route.post('/api/userAuth', userMiddleWare.isUserTrue, controller.userLogin);//api for loggin in
route.post('/api/verifyOTP', controller.verifyOTP);///api for verifying the otp
route.post('/api/sendOTP', controller.sendOTP);//api for send otp to mail
route.post('/api/updatePassword', controller.updatePassword);//api for to change the password,to change the password

route.get('/api/productList', productController.productListOnUser)//for get all the product specific category

route.get('/api/getUserInfo', controller.getSingleUserDetails)//to get single user details
route.get('/api/getAddressDetails', addressController.getAllAdress)//get all the address of user
route.post('/api/createAdress', addressController.createAdress);//to create a new adress
route.patch('/api/updateUserName', controller.updateName);//to update name of the user
route.patch('/api/updateUserMobileNumber', controller.updateMobileNumber)//to update mobile number
route.patch('/api/deleteAddress/:addressId', addressController.deleteAddress)//to delete address 
route.patch('/api/updateUserPassowrd',controller.updateUserPassword)//to update user passowrd
route.get('/api/userEditAddress/:addressId',addressController.editAddress);//to edit the address
route.put('/api/updateAddress/:selected',addressController.updateAddress);//to update Address

route.post('/api/addToCart/:productId',cartController.addToCart); //add to cart
route.get('/api/getUserCart/:userId',cartController.getUserCart);//get user cartDetails;
route.put('/api/removeCartItem/:cartItemId',cartController.removeCartItem);//remove single cart item;


route.post('/logout', controller.userLogout);//user logout


// route.all('*',services.errorPage);

module.exports = route;