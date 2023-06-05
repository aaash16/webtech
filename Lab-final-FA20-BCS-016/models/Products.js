const mongoose = require("mongoose");

const products = new mongoose.Schema({
    color: {
      type: String,
      required: true
    }, 
    title: {
      type: String,
      required: true
    }, 
    price: {
      type: Number,
      required: true
    }
})

const model = mongoose.model('Products', products);

module.exports = model;