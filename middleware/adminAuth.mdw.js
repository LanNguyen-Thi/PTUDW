module.exports = function auth(req, res, next) {
    if (req.session.Admintype == false) {

      req.session.retUrl = req.originalUrl;
      return res.redirect('/login/other');
    }
  
    next();
  }
 