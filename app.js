const express = require('express');
const app = express()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const CategoryService = require('./services/category.service');
const nunjucks = require('nunjucks');
const path = require('path');

const TEMPLATE_PATH = path.resolve(__dirname, './templates');

nunjucks.configure(TEMPLATE_PATH, { autoescape: true, express: app });

// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: 1024*1024*20, type: 'application/json' }))
app.use(bodyParser.urlencoded({extended: true, limit: 1024*1024*20}))

//connecting to mongoDB
const uri = `mongodb+srv://minhaj:${process.env.DB_PASSWORD}@cluster0.5wrjk.mongodb.net/test?retryWrites=true&w=majority`;
 mongoose.connect(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true
    }, () => console.log("connected to mongodb atlas..."));


const categoryRouter = require('./routes/category')
const productRouter = require('./routes/product')
const getAllProductsRouter = require('./routes/getAllProducts')

app.use(cors());

app.use('/category', categoryRouter);
app.use('/product', productRouter);
app.use('/allProducts', getAllProductsRouter);

app.use('/', async(req, res) => {
    // const categories = await CategoryService.fetchAllCategory();
    res.writeHead({
        'Content-Type': 'text/html'
    });
    res.end('<h1>Test</h1>');
    // res.render('index.html', {
    //     categories
    // });
})

module.exports = app;