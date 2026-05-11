module.exports = {
  // 1. Protection Middleware: Ensure user is logged in
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    // Bonus: Flash message for unauthorized access
    req.flash('error_msg', 'Please log in to view this resource.');
    res.redirect('/login');
  },

  // 2. Admin Middleware: Ensure only admins can access a route
  isAdmin: (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
      return next();
    }
    // Bonus: Flash message for users trying to access admin functions
    req.flash('error_msg', 'Access denied. Admins only.');
    res.redirect('/dashboard');
  },

  // 3. (Optional) Redirect if already logged in
  forwardAuthenticated: (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/dashboard');      
  }
};