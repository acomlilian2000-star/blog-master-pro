const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");

//   Show registration form
router.get("/register", (req, res) => res.render("register"));

//   POST /register
//    Handle registration logic
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const newUser = new User({ firstName, lastName, email, role });

    await User.register(newUser, password);

    req.flash("success_msg", "You are now registered and can log in");
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Registration failed: " + err.message);
    res.redirect("/register");
  }
});

//    GET /login
//    Show login form
router.get("/login", (req, res) => res.render("login"));

//   POST /login
//    Authenticate user
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  }),
);

//   GET /logout
//   Handle logout logic
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success_msg", "You are logged out");
    res.redirect("/login");
  });
});

module.exports = router;
