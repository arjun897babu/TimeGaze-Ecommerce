

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

