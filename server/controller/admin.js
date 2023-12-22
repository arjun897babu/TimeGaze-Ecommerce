const { response } = require('express');
const User = require('../model/userModelSchema');



const adminDetails = {
  emailAddress: 'admin@gmail.com',
  password: 'qwerty123'
}

exports.adminLogin = (req, res) => {
  const { email, password } = req.body;


  if (!email && !password) {
    req.session.errorMessage = 'All fields are required'
    console.log('all fields are required');
    res.status(401).redirect('/adminLogin')
  } else if (email != adminDetails.emailAddress) {
    req.session.errorMessage = 'Invalid email'
    console.log('Invalid email');
    res.status(401).redirect('/adminLogin')
  } else if (password != adminDetails.password) {
    req.session.errorMessage = 'Invalid password'
    console.log('Invalid password');
    res.status(401).redirect('/adminLogin');
  } else {
    console.log('verified');
    req.session.isAuthed = true;
    res.status(200).redirect('/adminHome');
  }

}

exports.adminLogout = (req, res) => {
  req.session.destroy();
  res.status(200).redirect('/adminLogin');
}


exports.findAllUser = async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      res.send('no user')
    } else {
      res.send(users)
    }
  }
  catch (error) {
    res.status(500).send(error)
  }
}


//blocking and unblocking the user


//block user
exports.blockUser = async (req, res) => {
  try {
  
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(userId, { isBlocked: true }, { new: true });
    if (user) {
      req.session.userBlocked = true;
      console.log( req.session.userBlocked);
      res.status(200).send('User blocked successfully');
    } else {
      res.status(404).send('User not found');
    }
    console.log( req.session.userBlocked);

  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};


//unblock user
exports.unblockUser = async (req, res) => {
  try {

    const { userId } = req.params

    const user = await User.findByIdAndUpdate(userId, { isBlocked: false }, { new: true });

    if (user) {

      res.status(200).send(`${user} blocked`)
    } else {
      res.status(404).send('user not found')
    }

  }
  catch (error) {
    res.status(500).send(error.message)
  }
}