const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { ensureAuthenticated } = require('../middleware/auth');

//  GET /dashboard
//    View all blogs
//  Private
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    // .populate('author') lets us access the user's name instead of just their ID
    const blogs = await Blog.find().populate('author').sort({ dateCreated: -1 });
    res.render('dashboard', { blogs });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

//    POST /blogs/add
//  Create a new blog
//  Private (Writers Only)
router.post('/blogs/add', ensureAuthenticated, async (req, res) => {
  try {
    //  Block Admin from writing blogs as per your requirement
    if (req.user.role === 'admin') {
      req.flash('error_msg', 'Admins are only authorized to review blogs, not create them.');
      return res.redirect('/dashboard');
    }

    const { title, description } = req.body;
    
    const newBlog = new Blog({
      title,
      description,
      author: req.user._id 
    });

    await newBlog.save();
    req.flash('success_msg', 'Blog created successfully and is pending approval!');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
});

//   POST /blogs/delete/:id
//    Remove a blog
//   Private (Owner or Admin)
router.post('/blogs/delete/:id', ensureAuthenticated, async (req, res) => {
  try {
    //  Ensure users can only delete THEIR blogs (unless they are admin)
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).send('Blog not found');
    }

    // Check if user owns the blog OR is an admin
    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      req.flash('error_msg', 'Not authorized to delete this blog');
      return res.redirect('/dashboard');
    }

    await Blog.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Blog removed successfully');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
});

module.exports = router;