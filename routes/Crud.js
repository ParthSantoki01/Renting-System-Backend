const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { response } = require('express')
const buyer = require('../models/Buyer')
const router= require('express').Router();
const seller = require('../models/Seller')
const Product = require('../models/Product.js')
const {
    check,
    validationResult
} = require("express-validator");



router.post('/seller',
    [
        check("title", "Please Enter a Valid Title").not().isEmpty(),
        check("imagepath", "Please Enter a Valid Image-Path").not().isEmpty(),
        check("description", "Please Enter a Valid Description").not().isEmpty(),
        check("price", "Please Enter a Valid price").not().isEmpty(),
        check("formatofprice", "Please Enter a Valid Format Of Price").not().isEmpty(),
        check("category", "Please select a Valid Category").not().isEmpty(),
        check("seller_id", "Please login").not().isEmpty()

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
                category: req.body.category,
                seller: req.body.seller_id,
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


router.put('/seller', async (req, res) => {
    try {
        let product = await Product.findById(req.body.product_id);
        if (!product) {
            return res.status(404).send({
                msg: "Product not found"
            });
        }
        product = await Product.findOneAndUpdate({
            _id: req.body.product_id
        }, req.body, {
            new: false,
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



router.delete('/seller', async (req, res) => {
    try {
        let product = await Product.findById(req.body.product_id);
        if (!product) {
            return res.status(404).send({
                msg: "Product not found"
            });
        }
        await Product.deleteOne({
            _id: req.body.product_id
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

module.exports=router