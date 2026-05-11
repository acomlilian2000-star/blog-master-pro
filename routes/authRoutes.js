
const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

// @route   GET /register
// @desc    Show registration form
router.get('/register', (req, res) => res.render('register'));

// @route   POST /register
// @desc    Handle registration logic
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    
    // Create a new user instance (without password yet)
    const newUser = new User({ firstName, lastName, email, role });

    // The .register() method is provided by passport-local-mongoose
    // It automatically hashes the password and saves the user
    await User.register(newUser, password);

    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Registration failed: ' + err.message);
    res.redirect('/register');
  }
});

// @route   GET /login
// @desc    Show login form
router.get('/login', (req, res) => res.render('login'));

// @route   POST /login
// @desc    Authenticate user
router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true // Automatically uses the error message from Passport
}));

// @route   GET /logout
// @desc    Handle logout logic
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });
});

module.exports = router;