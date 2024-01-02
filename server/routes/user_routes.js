const services = require('../services/user_render');
const controller = require('../controller/user');
const userMiddleWare = require('../middlewares/user/user');
const addressController = require('../controller/adress');
const productController = require('../controller/product');
const cartController = require('../controller/cart');
const orderController = require('../controller/order')


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
route.get('/profile', userMiddleWare.isBlocked,userMiddleWare.notUser, services.userProfile)//user Profile Home Page
route.get('/address', userMiddleWare.isBlocked,userMiddleWare.notUser, services.userAddress)//user Adress page
route.get('/cart', userMiddleWare.isBlocked,userMiddleWare.notUser, services.cart)//user cart
route.get('/editAddress',userMiddleWare.isBlocked,userMiddleWare.notUser,services.editAddress);//user edit Address page
route.get('/checkout',userMiddleWare.isBlocked,userMiddleWare.notUser,services.checkoutPage)//check out page
route.get('/orderHistory',userMiddleWare.isBlocked,userMiddleWare.notUser,services.orderHistory)//orderHistory page
route.get('/orderSingle',userMiddleWare.isBlocked,userMiddleWare.notUser,services.ordersingle)//ordersingle page



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
route.put('/api/makeDefault/:selectedId',addressController.makeDefault);//to make address as default

route.post('/api/addToCart/:productId',cartController.addToCart); //add to cart
route.get('/api/getUserCart/:userId',cartController.getUserCart);//get user cartDetails;
route.put('/api/removeCartItem/:cartItemId',cartController.removeCartItem);//remove single cart item;
route.put('/api/cartQuantiy/:cartItem',cartController.cartQuantity);//control cartQuantiy

route.post('/api/createOrder/:selectedAddressId',orderController.createOrder);// create user order details
route.get('/api/getUserOrder/:userId',orderController.getOrderDetails)//get user order details.


route.post('/logout', controller.userLogout);//user logout




module.exports = route;