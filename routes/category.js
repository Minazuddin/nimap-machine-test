const express = require('express');
const router = express.Router();
const Category = require('../model/category');
const Product = require('../model/product');

const nunjucks = require('nunjucks');
const path = require('path');
const app = express();

const TEMPLATE_PATH = path.resolve(__dirname, '../templates');

nunjucks.configure(TEMPLATE_PATH, { autoescape: true, express: app });

router.post('/', (req, res) => {
    const category = new Category({
        categoryName: req.body.categoryName,
        products: []
    })
    category.save()
    .then(result => res.status(200).json({
        message: 'Category created',
        result: result
    }))
    .catch(err => res.status(500).json({
        message: 'Error' + err
    }))
})

router.get('/', (req, res) => {
    Category.find()
    .exec()
    .then(categories => {
        res.render('index.html', {
            categories
        })
    })
    .catch(err => res.status(500).json({
        message: 'Error' + err
    }))
})

router.patch('/:categoryId', async(req, res) => {
    await Category.findOneAndUpdate({ _id: req.params.categoryId }, { $set: { categoryName: req.body.categoryName }}, {  useFindAndModify: false} )
    .then(async() => {
        await Product.updateMany({ categoryId: req.params.categoryId }, { $set: {categoryName: req.body.categoryName }})
            .then(async() => {
                Product.find({ categoryId: req.params.categoryId })
                .exec()
                .then(async(products) => {
                    await Category.findOneAndUpdate({ _id: req.params.categoryId }, {$set: { products: products }}, {  useFindAndModify: false})
                    .exec()
                    .then((result) => {
                        res.status(200).json({
                            message: 'Category Updated!'
                        })
                    })
                })
            })
    })
    .catch(err => res.status(500).json({
        message: 'Error' + err
    }))
})

router.delete('/:categorytId', async(req, res) => {
    const products = await Product.find({ categoryId: req.params.categorytId }).exec();
    if(products) {
        await Product.deleteMany({ categoryId: req.params.categorytId });
    }
    Category.deleteOne({ _id: req.params.categorytId })
    .then(() => res.status(200).json({message: 'Category deleted'}))
    .catch(err => res.status(500).json({
        message: 'Error' + err
    }))
})

router.delete('/', (req, res) => {
    Category.remove({})
    .then(() => res.status(200).json({message: 'Categories deleted'}))
    .catch(err => res.status(500).json({
        message: 'Error' + err
    }))
})

module.exports = router;