//add this middleware befor any route and after session middleware
module.exports = function (req, res, next) {
    res.locals.user = req.session.user;
    res.locals.flash = req.session.flash;
    req.session.flash = null;
    res.locals.pr_name = "name";
    res.locals.pr_type = "type";
    req.setFlash = function (type, message) {
      req.session.flash = { type, message };
    };
    req.setProdName = function(name) {
      res.locals.pr_name = name;
    }
    req.setProdType = function(type) {
      res.locals.pr_type = type;
    }
    //   res.locals.flash = { type: "success", message: "Hello Class" };
    next();
  };
  