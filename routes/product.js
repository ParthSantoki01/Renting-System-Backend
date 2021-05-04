const express = require('express');
const router = express.Router();
const Product = require('../models/Product.js');
const { check, validationResult } = require('express-validator');

// @desc    get all product
// @route   GET /product
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        res.send({
            error: false,
            product: products,
        });
    } catch (err) {
        console.error(err);
        res.send({
            error: true,
            msg: err.message,
        });
    }
});

// @desc    Get a Product using id
// @route   GET /product/:id
router.get('/:id', async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.send({
                error: true,
                msg: 'Product not found',
            });
        }
        res.send({
            error: false,
            product: product,
        });
    } catch (err) {
        console.error(err);
        res.send({
            error: true,
            msg: err.message,
        });
    }
});

// @desc    Get products using Category
// @route   GET/product/:category
router.get('/:category', async (request, response) => {
    try {
        let products = await Product.find({
            category: {
                $eq: request.params.catagory,
            },
        });
        if (!products) {
            return res.send({
                error: true,
                msg: 'Product not found',
            });
        }
        response.send({
            error: false,
            product: products,
        });
    } catch (error) {
        console.error(err);
        response.send({
            error: true,
            msg: err.message,
        });
    }
});

// @desc    Seller post a Product
// @route   POST /product/seller
router.post(
    '/seller',
    [
        check('title', 'Please Enter a Valid Title').not().isEmpty(),
        check('imagepath', 'Please Enter a Valid Image-Path').not().isEmpty(),
        check('description', 'Please Enter a Valid Description')
            .not()
            .isEmpty(),
        check('price', 'Please Enter a Valid price').not().isEmpty(),
        check('formatofprice', 'Please Enter a Valid Format Of Price')
            .not()
            .isEmpty(),
        check('category', 'Please select a Valid Category').not().isEmpty(),
        check('seller', 'Please Login').not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send({
                error: true,
                msg: errors.errors[0].msg,
            });
        }
        try {
            const product = new Product({
                title: req.body.title,
                imagepath: req.body.imagepath,
                description: req.body.description,
                price: req.body.price,
                formatofprice: req.body.formatofprice,
                category: req.body.category,
                seller: req.body.seller,
                available: true,
                status: '-',
            });

            const productSaved = await product.save();
            res.send({
                error: false,
                msg: 'Succsessfully Saved Product',
            });
        } catch (err) {
            console.error(err);
            res.send({
                error: true,
                msg: err.message,
            });
        }
    }
);

// @desc    Seller update a Product
// @route   PUT /product/seller/:id
router.put('/seller/:id', async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.send({
                error: true,
                msg: 'Product not found',
            });
        }
        product = await Product.findOneAndUpdate(
            {
                _id: req.params.id,
            },
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );
        res.send({
            error: false,
            msg: 'Succsessfully Updated',
        });
    } catch (err) {
        console.error(err);
        res.send({
            error: true,
            msg: err.message,
        });
    }
});

// @desc    Seller delete a Product
// @route   DELETE /product/seller/:id
router.delete('/seller/:id', async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.send({
                error: true,
                msg: 'Product Not Found',
            });
        }
        await Product.remove({
            _id: req.params.id,
        });
        res.send({
            error: false,
            msg: 'Succsessfully Deleted',
        });
    } catch (err) {
        console.error(err);
        res.send({
            error: true,
            msg: err.message,
        });
    }
});

module.exports = router;
