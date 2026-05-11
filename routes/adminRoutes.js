const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { isAdmin } = require('../middleware/auth');

// @route   POST /blogs/edit/:id
// @desc    Update blog status
// @access  Private (Admin Only)
router.post('/blogs/edit/:id', isAdmin, async (req, res) => {
  try {
    const { approveStatus } = req.body;
    
    // Find the blog and update its status
    await Blog.findByIdAndUpdate(req.params.id, { approveStatus });

    req.flash('success_msg', `Blog status updated to ${approveStatus}`);
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;