const express = require('express')
const router = express.Router()

const Product = require('../models/Product.js')

// @desc    Home
// @route   GET /home
router.get('/', (req, res) => {
    res.send('Home')
})

// @desc    Seller get all Products
// @route   GET/product/seller
router.get('/seller', async (req, res) => {
    try {
        const products = await Product.find({})
            .sort({
                createdAt: 'desc'
            })

        res.send(products)
    } catch (err) {
        console.error(err)
        res.status(500).send({
            msg: err.message
        });
    }
})

// @desc    Seller get a Product using id
// @route   GET /product/seller/:id
router.get('/seller/:id', async (req, res) => {
    try {
        let product = await Product.findById(req.params.id).lean()

        if (!product) {
            return res.status(404).send({
                msg: "Product not found"
            });
        }
        res.send(product)
    } catch (err) {
        console.error(err)
        res.status(500).send({
            msg: err.message
        });
    }
})
  
// @desc    Get products using Category
// @route   GET/product/Seller/:category

router.get("/seller/:category", async (request, response) => {
    try {
        var products = await Product.findById(request.params.catagory).exec();
        response.send(products);
    } catch (error) {
        console.error(err)
        response.status(500).send({
            msg: err.message
        });
    }
});


module.exports = router;