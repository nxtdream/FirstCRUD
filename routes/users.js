const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const session = require("express-session");
const isLoggedIn = require("../middleware");
const users = require("../controllers/user");

router.get("/register", users.renderFormRegis);

router.post("/register", catchAsync(users.createUser));

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
      keepSessionInfo: true,
    }),
    users.userLogin
  );

router.get("/logout", users.userLogOut);

module.exports = router;
