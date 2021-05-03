const seller = require('../models/Seller.js')
const buyer = require ('../models/Buyer.js')
const product = require('../models/Product.js')
const express = require('express')
const router = express.Router()

router.post('/qwer',async (req,res)=>{
    try {
        const filter = {_id : req.body.seller_id};
        const update = {
            $addToSet : {
                requestforaddress : req.body.buyer_id
            }
            };
        
      let sell = await seller.findOneAndUpdate(filter,update,{
          new : false
      }).then(res.send("Request Send to Seller"));
    }catch (err) {
        console.error(err)
        res.status(500).send({
            msg: err.message
        });
    }
})

//Show seller buyer details
router.get('/qr',async(req,res)=>{
    try{
        let abc = await seller.findById(req.body.seller_id)
        await buyer.find({_id : abc.requestforaddress},{firstname:1,lastname:1,email:1,_id:0}).then(data =>{
            res.send(data)
        });
    }catch{
        console.error(err);
        res.status(500).send({
            msg: err.message
        });
    }
})

//when click accpt --> body (buyer id,seller id)
// Save data in buyer_id
//Remove buyer_id from reqs
router.post('/asdfg',async(req,res)=>{
    try{
        let abcd = await seller.findById(req.body.seller_id)
        const filter = {_id : req.body.buyer_id};
        const update = {
            $addToSet : {
                sellerdetail: req.body.seller_id
                    
                }
        };
        
        let dfg = await buyer.findOneAndUpdate(filter,update,{
            new:false
        }).then(res.send("Buyer given access sucessfully"))
        await seller.findOneAndUpdate({
            _id : req.body.seller_id
        },
        {
            $pull :{
                requestforaddress : req.body.buyer_id
            }
        }
        )

    }catch (err) {
        console.error(err)
        res.status(500).send({
            msg: err.message
        });
    }
})

//Get seller details
router.get('/asdfg',async(req,res)=>{
    try{
        let abc = await buyer.findById(req.body.buyer_id)
        await seller.find({_id : abc.sellerdetail},{firstname:1,lastname:1,address:1,_id:0}).then(data =>{
            res.send(data)
        });
    }catch(err){
        console.error(err);
        res.status(500).send({
            msg: err.message
        });
    }
})

// Get all the products for a given seller
router.get('/',async(req,res)=>{
    try{
        let asd = product.find({seller : req.body.seller_id}).then(data=>{
            res.send(data)
        })
    }catch(err){
        console.error(err);
        res.status(500).send({
            msg: err.message
        });
    }
})




module.exports = router