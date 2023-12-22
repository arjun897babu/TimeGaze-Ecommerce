const services = require('../services/user_render');
const controller = require('../controller/user');
const userMiddleWare = require('../middlewares/user/user');
const addressController = require('../controller/adress');
const productController = require('../controller/product');


const express = require('express');
const route = express.Router();

route.get('/', userMiddleWare.isBlocked,services.home);//home page
route.get('/login',userMiddleWare.isUser,services.login);//login page
route.get('/signup', userMiddleWare.isUser, services.signup);//signup page
route.get('/emailVerify', userMiddleWare.isUser, services.emailverify);//otp verification for email
route.get('/passwordReset', userMiddleWare.isUser, services.passwordReset);//send otp for resetting passowrd
route.get('/resetPassword', userMiddleWare.isUser, services.resetPassword);//resetting passowrd
route.get('/productList',services.productListPage)//product list page
route.get('/singleProduct',services.singleProduct);//single product page
route.get('/profile',services.userProfile)//user Profile Home Page
route.get('/address',services.userAddress)//user Adress page


route.post('/api/users', controller.createUser);//api for register a usr
route.post('/api/userAuth', userMiddleWare.isUserTrue, controller.userLogin);//api for loggin in
route.post('/api/verifyOTP', controller.verifyOTP);///api for verifying the otp
route.post('/api/sendOTP', controller.sendOTP);//api for send otp to mail
route.post('/api/updatePassword', controller.updatePassword);//api for to change the password,to change the password
route.get('/api/productList',productController.productListOnUser)//for get all the product specific category
route.post('/api/createAdress',addressController.createAdress);//to create a new adress
route.get('/api/getAddressDetails',addressController.getAllAdress)
route.patch('/api/deleteAddress/:addressId',addressController.deleteAddress)//to delete address 
route.post('/logout', controller.userLogout);//user logout


// route.all('*',services.errorPage);

module.exports = route;