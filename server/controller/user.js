
const User = require('../model/userModelSchema');
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const OTP = require('../model/OTPModel');
const mailSender = require('../services/mailSender');

exports.createUser = async (req, res) => {


  const { name, email, phonenumber, password } = req.body
  if (!name || !email || !phonenumber || !password) {
    req.session.errorMessage
      = 'All fields are required';
    console.log(req.session.errorMessage);

    return res.status(400).redirect('/signup');
  }
  const existingUser = await User.findOne({
    $or: [
      { email: email },
      { phonenumber: phonenumber }
    ]
  });

  if (existingUser) {

    if (existingUser.email === email) {
      req.session.errorMessage
        = 'Email already exist'
    } else {
      req.session.errorMessage
        = 'Phone number exist'
    }
    console.log(req.session.errorMessage);
    return res.status(400).redirect('/signup');
  } else {


    try {

      const salt = 10;
      const hasedPassowrd = await bcrypt.hash(password, salt);

      const newUser = new User({
        name: name,
        email: email,
        phonenumber: phonenumber,
        password: hasedPassowrd,
      });

      let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false })

     

      const savedUser = await newUser.save();


      const otpPlayload = { email: req.body.email, otp };
      const otpBody = await OTP.create(otpPlayload);

      req.session.otpPurpose = 'registerUser';
      req.session.useremail = newUser.email;

      res.redirect('/emailVerify');
      await sendVerificationEmail(newUser.email, otp);


    } catch (error) {
      console.log(error)
      res.status(500).send(error.message);
    }
  }
};

exports.userLogin = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      req.session.invalidMessage = 'All fields are required'
      return res.status(400).redirect('/login')
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      req.session.useremail = '';
      req.session.invalidMessage = 'no user found';
      console.log(req.session.invalidMessage);
      return res.status(400).redirect('/login');
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
      req.session.useremail =email;
      req.session.invalidMessage = 'Invalid password';
      console.log(req.session.invalidMessage);
      return res.status(400).redirect('/login');
    }
    req.session.email = '';
    if (validPassword && !user.isBlocked) {

      req.session.isUserAuth = true;
      req.session.email =email;
    
      res.status(200).redirect('/');

    } else {

      req.session.invalidMessage = 'Account blocked';
      res.status(200).redirect('/login');
    }

  } catch (error) {

    console.error(error);
    res.status(500).send('Internal Server Error');

  }

}

//otp verify 

exports.verifyOTP = async (req, res) => {


  try {


    const { email, otp } = req.body;
    console.log(req.body);
    if (!email || !otp) {
      return res.status(400).send(
        'All fields are required',
      );
    }

    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

    if (response.length === 0 || otp !== response[0].otp) {
      
      console.log(email);
      req.session.errorMessage = 'otp not valid'
      console.log('otp not valid');
      return res.status(401).redirect('/emailVerify');

    }

    const purpose = req.session.otpPurpose;
    req.session.useremail = email;
    if (purpose === 'resetPassword') {

      res.status(200).redirect('/resetPassword');

    } else if (purpose === 'registerUser') {

      const updateUsers = await User.updateOne({ email }, { $set: { isVerified: true } });

      res.status(200).redirect('/login');
    }

  }

  catch (error) {
    console.log(error.message);
    return res.status(500).send(error.message);
  }

}


//generating otp for resetting password

exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).send(`all fields are required`);
    }
    let userExist = await User.findOne({ email: email });

    if (!userExist) {
      req.session.errorMessage = 'user not exist'
      return res.status(401).redirect('/passwordReset');

    } else {

      let otp = otpGenerator.generate(6,
        {
          upperCaseAlphabets: false,
          lowerCaseAlphabets: false,
          specialChars: false
        })

      const otpPlayload = { email: email, otp };
      const otpBody = await OTP.create(otpPlayload);


      req.session.otpPurpose = 'resetPassword';
      req.session.useremail = email;


      res.status(200).redirect('/emailVerify');
      await sendVerificationEmail(email, otp);

    }
  }

  catch (error) {
    res.status(500).send(error.message);
    console.log(error)
  }

}


//update passowrd

exports.updatePassword = async (req, res) => {

  try {
    const { email, password } = req.body;
    req.session.useremail = email;
    console.log(req.body)
    if (!password) {
      return res.status(400).redirect('/resetPassword');
    }

    const user = await User.findOne({ email });
    console.log(user.password)
    const oldPassword = bcrypt.compareSync(password, user.password);
    if (oldPassword) {
      req.session.errorMessage = 'Enter a new password'
      res.status(401).redirect('/resetPassword');
    } else {
      const salt = 10;
      const hasedPassowrd = await bcrypt.hash(password, salt);
      user.password = hasedPassowrd;
      console.log(user.password);
      await user.save();

      res.status(201).redirect('/login')
    }
  }
  catch (error) {
    console.log(error)
    res.status(500).send(error.message);
  }

}

//user logout
exports.userLogout = (req, res) => {
  req.session.destroy();
  res.status(200).redirect('/');
}

async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(email, 'Time Gaze Watches - OTP Confirmation',
      `<html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f4f4f4;
              color: #333;
              margin: 0;
              padding: 0;
            }
            h1 {
              color: #007bff;
            }
            p {
              line-height: 1.6;
            }
          </style>
        </head>
        <body>
          <h1>Please confirm your OTP</h1>
          <p>Dear Time Gaze Watches customer,</p>
          <p>Here is your OTP code for verification: <strong>${otp}</strong></p>
          <p>This OTP is required to complete your verification process.</p>
        </body>
      </html>`
    );
  } catch (error) {
    console.log(error.message);
  }
}