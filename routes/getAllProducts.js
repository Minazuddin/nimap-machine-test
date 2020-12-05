const express = require('express');
const router = express.Router();
const Category = require('../model/category');
const Product = require('../model/product');
const nunjucks = require('nunjucks');
const path = require('path');
const app = express();

const TEMPLATE_PATH = path.resolve(__dirname, '../templates');

nunjucks.configure(TEMPLATE_PATH, { autoescape: true, express: app });

router.get('/:categoryName/:skip/:page', async(req, res) => {
    const skip = Number(req.params.skip);
    const categoryName = req.params.categoryName;
    await Product.find({ categoryName: req.params.categoryName })
        .skip(skip)
        .limit(10)
        .exec()
        .then(products => {
            res.render(req.params.page, {
                products,
                categoryName
            })
        })
        .catch(err => res.status(200).json({
            message: err
        }))
})

module.exports = router;