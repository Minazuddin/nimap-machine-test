const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    categoryName: { type: String },
    products: []
    
});

module.exports = mongoose.model('Category', categorySchema);