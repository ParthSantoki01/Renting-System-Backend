
const express = require('express')
const router = express.Router()
const Product = require("../models/Product");
const Buyer = require("../models/Buyer");
const Seller = require("../models/Seller");
// add in product.js
// @desc    get all Products
// @route   GET /product
router.get("/", async (req, res) => {
    try {
      const products = await Product.find({}).then(data =>{
          res.send(data)
      });
    } catch (err) {
        console.error(err)
        res.status(500).send({
            msg: err.message
        });
    }
  });
  
// in seller.js
// @desc    get seller profile
// @route   GET /seller/profile
router.get("/profile", authseller, async (req, res) => {
    try {
        const seller = await Seller.find({_id : req.body.seller_id}).then(data => {
            res.send(data)
        })
    } catch (err) {
        console.log(err);
        res.status(500).send({
            msg: err.message
        });
    }
});

//in buyer.js
// @desc    get seller profile
// @route   GET /buyer/profile
router.get("/profile", auth, async (req, res) => {
    try {
        const buyer = await Buyer.find({_id : req.body.buyer._id}).then(data =>{
            res.send(data)
        })
    } catch (err) {
        console.log(err);
        res.status(500).send({
            msg: err.message
        });
    }
});
module.exports = router