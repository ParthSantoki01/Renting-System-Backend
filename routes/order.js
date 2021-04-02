const Mongoose = require('mongoose')
const order = require('../models/order')

const express = require('express')
const router = express.Router()

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

module.exports = router;