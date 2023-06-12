const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uname: {
      type: String,
      unique: true,
      required: true
    }, 
    email: {
      type: String,
      unique: true,
      required: true
    }, 
    phno: {
      type: Number,
      required: true
    }, 
    password: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      required: true
    }
})

const monmodel = mongoose.model('User', userSchema);

module.exports = monmodel;