const category = require('../model/category');
const Category = require('../model/category');

exports.fetchAllCategory = async() => {
    return await category.find({}).exec();
}