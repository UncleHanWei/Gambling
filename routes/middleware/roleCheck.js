let roleCheck = (req, res, next) => {
  if(req.session.user.role != 0) {
    res.redirect('/');
  } else {
    next();
  }
}

module.exports = roleCheck;