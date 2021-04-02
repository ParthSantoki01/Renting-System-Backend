const Mongoose = require('mongoose')
const order = require('../models/order')

const express = require('express')
const router = express.Router()
const Product = require("../models/product");


router.post('/checkout',async(req,res)=> {
    
    const order1 = await new order({
        userid : req.body._id,
        productid : req.body.productid,
        address : req.body.address,
        totalPrice : req.body.price,
    });
    await order1.save()
        console.log('Sucessfully bought product')
        res.redirect('/')
});
router.get("/:orderId", (req, res, next) => {
    Order.findById(req.params.orderId)
      .exec()
      .then(order => {
        if (!order) {
          return res.status(404).json({
            message: "Order not found"
          });
        }
        res.status(200).json({
          order: order,
          request: {
            type: "GET",
            url: "http://localhost:3000/orders"
          }
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
  router.get("/:firstname", (req, res, next) => {
    Order.findById(req.params.firstname)
      .exec()
      .then(order => {
        if (!order) {
          return res.status(404).json({
            message: "Order not found"
          });
        }
        res.status(200).json({
          order: order,
          request: {
            type: "GET",
            url: "http://localhost:3000/orders"
          }
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });

module.exports = router;


