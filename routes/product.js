const express = require('express')
const router = express.Router()
const Product = require('../models/Product.js')
const Category = require('../models/Category.js')
const {
    check,
    validationResult
} = require("express-validator");

// @desc    Home
// @route   GET /home
router.get('/', (req, res) => {
    res.send('Home')
})

// @desc    Buyer get all Categories
// @route   GET /product/buyer/categories
router.get('/buyer/categories', async (req, res) => {
    try {
        const category = await Category.find({})
        res.send(category)
    } catch (err) {
        console.error(err)
        res.status(500).send({
            msg: err.message
        });
    }
})

// @desc    Buyer get all Products
// @route   GET /product/buyer
router.get('/buyer', async (req, res) => {
    try {
        const products = await Product.find({})
        res.send(products)
    } catch (err) {
        console.error(err)
        res.status(500).send({
            msg: err.message
        });
    }
})


// @desc    Seller get all Products
// @route   GET /product/seller
router.get('/seller', async (req, res) => {
    try {
        const products = await Product.find({})
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
        let product = await Product.findById(req.params.id);
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
        let products = await Product.find({
            category: {
                $eq: request.params.catagory
            }
        });
        if (!products) {
            return res.status(404).send({
                msg: "Product not found"
            });
        }
        response.send(products);
    } catch (error) {
        console.error(err)
        response.status(500).send({
            msg: err.message
        });
    }
});

// @desc    Seller post a Product
// @route   POST /product/seller
router.post('/seller',
    [
        check("title", "Please Enter a Valid Title").not().isEmpty(),
        check("imagepath", "Please Enter a Valid Image-Path").not().isEmpty(),
        check("description", "Please Enter a Valid Description").not().isEmpty(),
        check("price", "Please Enter a Valid price").not().isEmpty(),
        check("formatofprice", "Please Enter a Valid Format Of Price").not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                msg: errors.errors[0].msg
            });
        }
        try {
            const product = new Product({
                title: req.body.title,
                imagepath: req.body.imagepath,
                description: req.body.description,
                price: req.body.price,
                formatofprice: req.body.formatofprice,
                category: null,
                seller: null,
                available: req.body.available,
                status: "-"
            });

            const productSaved = await product.save();
            res.send({
                msg: "Succsess",
                product: productSaved
            });
        } catch (err) {
            console.error(err)
            res.status(500).send({
                msg: err.message
            });
        }
    }
)

// @desc    Seller update a Product
// @route   PUT /product/seller/:id
router.put('/seller/:id', async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send({
                msg: "Product not found"
            });
        }
        product = await Product.findOneAndUpdate({
            _id: req.params.id
        }, req.body, {
            new: true,
            runValidators: true,
        })
        res.send({
            msg: "Succsess",
            product: product
        })
    } catch (err) {
        console.error(err)
        res.status(500).send({
            msg: err.message
        });
    }
})

// @desc    Seller delete a Product
// @route   DELETE /product/seller/:id
router.delete('/seller/:id', async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send({
                msg: "Product not found"
            });
        }
        await Product.remove({
            _id: req.params.id
        })
        res.send({
            msg: "Succsess",
            product: product
        })
    } catch (err) {
        console.error(err)
        res.status(500).send({
            msg: err.message
        });
    }
})

// @desc    Buyer get a Product using id
// @route   GET /buyer/:id
router.get('/buyer/:id', async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
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

// @desc    Buyer get a Product by category
// @route   GET /buyer/category
router.get('/buyer/:category', async (req, res) => {
    try {
        let product = await Product.find({
            catagory: {
                $eq: req.params.category
            }
        });
        if (!product) {
            return res.status(404).send({
                msg: "Product not found."
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

// @desc    Seller get all Categories
// @route   GET /seller/categories
router.get('/seller/categories', async (req, res) => {
    try {
        const category = await Category.find({})
        res.send(category)
    } catch (err) {
        console.error(err)
        res.status(500).send({
            msg: err.message
        });
    }
})



module.exports = router;