const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { response } = require('express')
const buyer = require('../models/Buyer')
const router= require('express').Router();
const seller = require('../models/Seller')




router.post('/forgotPassword',async(req, res, next) =>{
    try{
        const buy = await buyer.findOne({email: req.body.email})
        if(!buyer){
        return next(new AppError('Enter a valid email.'));
       }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        buy.password=hashedPassword
        await buy.save() 
        res.status(200).json({msg:"Password Changed"})
    }
 catch(error){
        res.status(500).json({error})
    }
});

//Seller

router.post('/sforgotPassword',async(req, res, next) =>{
    try{
        const sell = await seller.findOne({email: req.body.email})
        if(!seller){
        return next(new AppError('Enter a valid email.'));
       }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        sell.password=hashedPassword
        await sell.save() 
        res.status(200).json({msg:"Password Changed"})
    }
 catch(error){
        res.status(500).json({error})
    }
});

module.exports=router