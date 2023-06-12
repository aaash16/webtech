const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
      type: String,
      required: true
    }, 
    name: {
      type: String,
      required: true
    }, 
    quantity: {
      type: Number,
      required: true
    }, 
    price: {
      type: Number,
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
})

const cart = mongoose.model('Cart', userSchema);

module.exports = cart;