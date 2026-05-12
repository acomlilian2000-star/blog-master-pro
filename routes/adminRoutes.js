const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { isAdmin } = require('../middleware/auth');

//   POST /blogs/edit/:id
//    Update blog status
//  Private (Admin Only)
router.post('/blogs/edit/:id', isAdmin, async (req, res) => {
  try {
    const { approveStatus } = req.body;
    
    // Find the blog and update its status (only admin)
    await Blog.findByIdAndUpdate(req.params.id, { approveStatus });

    req.flash('success_msg', `Blog status updated to ${approveStatus}`);
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;