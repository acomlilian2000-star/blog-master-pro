const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
});

// This plugin adds username, hash, and salt fields to store the password
const pluginFunction = typeof passportLocalMongoose === 'function' 
  ? passportLocalMongoose 
  : passportLocalMongoose.default;

userSchema.plugin(pluginFunction, { usernameField: 'email' });
module.exports = mongoose.model('User', userSchema);