const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    }, 
    category: {
      type: String,
      required: true
    },
    type: {
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
    front_img: {
      type: String,
      required: true
    },
    back_img: {
      type: String,
      required: true
    }
})

const monmodel = mongoose.model('Products', userSchema);

module.exports = monmodel;