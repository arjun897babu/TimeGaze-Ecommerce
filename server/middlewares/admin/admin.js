const mongoose = require('mongoose');

exports.isAdmin = (req, res, next) => {
  if (req.session.isAuthed) {
    next()
  } else {
    res.redirect('/adminLogin')
  }
}

exports.isNotAdmin =  (req, res, next) => {
  if (req.session.isAuthed) {
    res.redirect('/adminHome')
  } else {
   next()
  }
}

exports.isProduct = (req,res,next)=>{

  const {pid} = req.query;
  if(mongoose.Types.ObjectId.isValid(pid)) next();
  else return res.redirect('/adminproducts');
}
exports.isCategory = (req,res,next)=>{

  const {categoryId} = req.query;
  if(mongoose.Types.ObjectId.isValid(categoryId)) next();
  else return res.redirect('/adminCategory');
}

