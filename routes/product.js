const express = require('express');
const router = express.Router();
const Product = require('../model/product');
const Category = require('../model/category');

router.post('/', (req, res) => {
    Category.findOne({ categoryName: req.body.categoryName})
    .exec()
    .then(result1 => {
        const product = new Product({
            productName: req.body.productName,
            categoryName: req.body.categoryName,
            categoryId: result1._id
        })
        product.save()
        .then(() => {
            Product.find({ categoryName: req.body.categoryName })
            .exec()
            .then((products) => {
                Category.updateOne({ categoryName:  req.body.categoryName}, { $set: { products: products } })
                .then(() => {
                    res.status(200).json({
                        message: 'Product created'
                    })
                })
            })
        })
    })
    .catch(err => res.status(500).json({
        message: 'Error' + err
    }))
})

router.get('/', (req, res) => {
    Product.find()
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'fetched',
            product: result
        })
    })
    .catch(err => res.status(500).json({
        message: 'Error' + err
    }))
})

router.patch('/:productId', async(req, res) => {
    await Product.findOneAndUpdate({ _id: req.params.productId }, { $set: { productName: req.body.productName } }, {  useFindAndModify: false})
    .then((product) => {
        Product.find({ categoryName: product.categoryName })
        .exec()
        .then(async(products) => {
           await Category.findOneAndUpdate({ categoryName: product.categoryName }, {$set: { products: products }}, {  useFindAndModify: false})
            .then(() => {
                res.status(200).json({
                    message: 'Product Updated!'
                })
            })
        })
    })
    .catch(err => res.status(500).json({
        message: 'Error' + err
    }))
})

router.delete('/:productId', (req, res) => {
    Product.deleteOne({ _id: req.params.productId })
    .then(() => res.status(200).json({message: 'Product deleted'}))
    .catch(err => res.status(500).json({
        message: 'Error' + err
    }))
})

router.delete('/', (req, res) => {
    Product.remove({})
    .then(() => res.status(200).json({message: 'Products deleted'}))
    .catch(err => res.status(500).json({
        message: 'Error' + err
    }))
})

module.exports = router;