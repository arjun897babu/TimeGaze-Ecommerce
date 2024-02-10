const nodemailer = require('nodemailer');
require('dotenv').config();
 
const mailSender = async (email, title, body) => {
  try {
    // Create a Nodemailer transporter
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      auth: {
        user:process.env.AUTH_EMAIL,
        pass:process.env.AUTH_PASS,
      }, 
    });

    // Send email to the user
    let info = await transporter.sendMail({
      from: 'Timegaze watches',
      to: email,
      subject: title,
      html: body,
    });

    // console.log("Email info: ", info);
    return info;
  } catch (error) {
    console.error(error);
  }
};


module.exports = mailSender;