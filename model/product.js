const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    productName: { type: String },
    categoryName: { type: String  },
    categoryId: { type: String }
});

module.exports = mongoose.model('Product', productSchema);