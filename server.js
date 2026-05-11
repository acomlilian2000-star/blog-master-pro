// 1. Dependencies
const express = require("express");
const expressSession = require("express-session");
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
require('dotenv').config();

const connectDB = require('./config/db');
const User = require('./models/User');

// 2. Instantiations
const app = express();
const port = process.env.PORT || 3000;

// 3. Database Connection
connectDB();

// 4. View Engine (PUG)
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 5. Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET || "BlogMasterSecret",
    resave: false,
    saveUninitialized: false,
  })
);

// Flash messages
app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global variables for PUG
app.use((req, res, next) => {
  res.locals.currentUser = req.user || null;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// 6. Routes
app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/blogRoutes'));
app.use('/', require('./routes/adminRoutes'));


// 8. Start Server
app.listen(port, () =>
  console.log(`Blog-Master-Pro running on port ${port}`)
);