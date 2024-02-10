const easyInvoice = require('easyinvoice');
const fs = require('fs');
const mongoose = require('mongoose')
const Order = require('../model/orderSchema');

exports.invoice = async (req, res, next) => {

  try {

    const { orderId } = req.params

    if (!orderId) return res.status(400).json(
      {
        status: 'error', message: 'orderId is missing'
      }
    )

    const [orderDetails] = await Order.aggregate([{ $match: { _id: new mongoose.Types.ObjectId(orderId) } }]);
    console.log(orderDetails.orderId);
    console.log(new Date(orderDetails.orderDate).toLocaleDateString('en-Us'))

    var data = {
      "images": {
        "logo": fs.readFileSync('public/image/timegazelogo.png', 'base64'),
      },
      "settings": {
        "locale": 'en-US',
        "currency": 'INR'
      },
      "sender": {
        "company": "Time Gaze",
        "address": "Sample Street 123",
        "zip": "767303",
        "city": "Kozhikode",
        "country": "India"

      },

      "client": {
        "company": `${orderDetails.address.name}`,
        "address": `${orderDetails.address.address}`,
        "zip": `${orderDetails.address.pincode}`,
        "city": `${orderDetails.address.state}`,
        "country": 'India  '

      },
      "information": {

        "number": `${orderDetails.orderId}`,

        "date": `${new Date(orderDetails.orderDate).toLocaleDateString('en-Us', { timeZone: 'Asia/Kolkata' })}`,
      },

      "products": orderDetails.orderItems.map(item => {
        return {
          "quantity": item.quantity,
          "description": item.productName,
          "tax-rate": 0,
          "price": item.discountPrice
        };
      }),

    };
    const invoice = await easyInvoice.createInvoice(data);
    // await fs.writeFileSync("invoice.pdf", invoice.pdf, 'base64');
    res.status(200).json(
      {
        status: 'success',
        invoice: invoice,
        invoiceNumber:`${orderDetails._id}${orderDetails.orderId}`
      }
    )
  } catch (error) {
    next(error)
  }
};