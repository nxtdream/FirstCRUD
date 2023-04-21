const User = require("../models/user");
const session = require("express-session");
const isLoggedIn = require("../middleware");

module.exports.renderFormRegis = (req, res) => {
  res.render("user/register");
};

module.exports.createUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", `Welcomd ${username}`);
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("user/login");
};

module.exports.userLogin = (req, res) => {
  req.flash("success", "Welcome Back !!");
  const redirectUrl = req.session.returnTo || "/campgrounds";
  console.log(redirectUrl);
  res.redirect(redirectUrl);
};

module.exports.userLogOut = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!!!");
    res.redirect("/campgrounds");
  });
};
