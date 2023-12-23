

const User = require('../../model/userModelSchema')
//user verified or not for new regirstered usr
exports.isUserTrue = async (req, res, next) => {
  try {

    const { email, password } = req.body;

    const users = await User.findOne({ email });
    console.log(users);
    if (!users) {
      return next()
    }
    if (users.isVerified) {

      next();
    } else {
      req.session.invalidMessage = 'Your are not verified,please register after some times';
      await User.deleteOne({ email })
      console.log('user not verified');
      res.status(401).redirect('/login')
    }

  } catch (error) {
    res.status(500).send(error.message)
  }
}




//user is authenticated
exports.isUser = (req, res, next) => {
  if (req.session.isUserAuth) {
    return res.redirect('/');
  } else {
    next();
  }
};

exports.notUser =(req, res, next) => {
  if (req.session.isUserAuth) {
    
    next();
   
  } else {
     res.redirect('/login');
  }
};


// check user is blocked or not

exports.isBlocked = async (req,res,next) =>{
  try{
    const userEmail = req.session.email;
    console.log(userEmail);
    if(!userEmail){
       return next()
    }
    if(userEmail){
      const userBlocked = await User.findOne({email:userEmail});
      console.log(userBlocked);
      if(userBlocked.isBlocked){

        req.session.destroy();
        res.redirect('/login');
      }else{
        next()
      }
    }

  }
  catch(error){
    res.status(500).send('internal server error')
  }
}
