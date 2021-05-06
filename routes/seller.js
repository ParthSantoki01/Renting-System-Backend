const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const Buyer = require('../models/Buyer.js');
const Seller = require('../models/Seller.js');
const Product = require('../models/Product.js');
const authseller = require('../middleware/authseller.js');

// Load config
dotenv.config();

// @desc    SignUp | register
// @route   POST /seller/register
router.post(
    '/register',
    [
        check('firstname', 'Please Enter a Valid Firstname').not().isEmpty(),
        check('lastname', 'Please Enter a Valid Lastname').not().isEmpty(),
        check('address', 'Please Enter a Valid Address').not().isEmpty(),
        check('email', 'Please Enter a Valid E-mail').isEmail(),
        check('password', 'Please Enter a Valid Password').isLength({
            min: 8,
        }),
        check('idproof', 'Please Enter a Id-Proof').not().isEmpty(),
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
            let seller = await Seller.findOne({
                email: req.body.email,
            });
            if (seller) {
                return res.send({
                    error: true,
                    msg: 'User already exists',
                });
            }

            seller = new Seller({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                address: req.body.address,
                email: req.body.email,
                password: req.body.password,
                username: '',
                idproof: req.body.idproof,
                requestforaddress: [],
                productlist: [],
                myorder: [],
            });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            seller.password = hashedPassword;

            const savedSeller = await seller.save();
            res.send({
                error: false,
                userid: seller._id,
            });
        } catch (err) {
            console.log(err);
            res.send({
                error: true,
                msg: err.message,
            });
        }
    }
);

// @desc    SignIn | Login
// @route   POST /seller/login
router.post(
    '/login',
    [
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 'Please enter a valid password').isLength({
            min: 8,
        }),
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
            const seller = await Seller.findOne({
                email: req.body.email,
            });
            if (!seller) {
                return res.send({
                    error: true,
                    msg: 'User is not registered',
                });
            }

            const validPassword = await bcrypt.compare(
                req.body.password,
                seller.password
            );
            if (!validPassword) {
                return res.send({
                    error: true,
                    msg: 'Password is not valid',
                });
            }

            const token = jwt.sign(
                {
                    _id: seller._id,
                },
                process.env.TOKEN_SECRET
            );
            res.header('auth_token', token).send({
                error: false,
                auth_token: token,
            });
        } catch (err) {
            console.log(err);
            res.send({
                error: true,
                msg: err.message,
            });
        }
    }
);

// @desc    Details | Profile, if Seller logged in already else error | Seller auth-token header
// @route   GET /seller/detail
router.get('/detail', authseller, async (req, res) => {
    try {
        const seller = await Seller.find(
            mongoose.Types.ObjectId(req.seller._id)
        );
        res.send({
            error: false,
            seller: seller,
        });
    } catch (err) {
        console.log(err);
        res.send({
            error: true,
            msg: err.message,
        });
    }
});

// @desc    change password
// @route   GET /seller/forgot
router.post('/forgot', authseller, async (req, res) => {
    try {
        const seller = await Seller.find(
            mongoose.Types.ObjectId(req.seller._id)
        );
        if (!seller) {
            return res.send({
                error: true,
                msg: 'Enter a valid email',
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        seller.password = hashedPassword;
        await seller.save();
        res.send({
            error: false,
            msg: 'Password Changed',
        });
    } catch (err) {
        console.log(err);
        res.send({
            error: true,
            msg: err.message,
        });
    }
});

// @desc    my all products
// @route   GET /myproducts
router.post('/myproducts', async (req, res) => {
    try {
        let data = Product.find({ seller: req.body.seller_id }).then((data) => {
            res.send({
                error: false,
                data: data,
            });
        });
    } catch (err) {
        console.log(err);
        res.send({
            error: true,
            msg: err.message,
        });
    }
});

// @desc    show all pending requests
// @route   GET /myrequest
router.post('/myrequest', async (req, res) => {
    try {
        let seller = await Seller.findById(req.body.seller);
        await Buyer.find(
            { _id: seller.requestforaddress },
            { firstname: 1, lastname: 1, email: 1 }
        ).then((data) => {
            res.send({
                error: false,
                data: data,
            });
        });
    } catch (err) {
        console.log(err);
        res.send({
            error: true,
            msg: err.message,
        });
    }
});

// @desc    accept request
// @route   Post /accept
router.post('/accept', async (req, res) => {
    try {
        const filter = { _id: req.body.buyer };
        const update = {
            $addToSet: {
                sellerdetail: req.body.seller,
            },
        };

        let accept = await Buyer.findOneAndUpdate(filter, update, {
            new: false,
        }).then(
            res.send({
                error: false,
                msg: 'Buyer given access sucessfully',
            })
        );
        await Seller.findOneAndUpdate(
            {
                _id: req.body.seller,
            },
            {
                $pull: {
                    requestforaddress: req.body.buyer,
                },
            }
        );
    } catch (err) {
        console.log(err);
        res.send({
            error: true,
            msg: err.message,
        });
    }
});

//@desc Get the name of the seller
//@route GET /seller/getname

router.get('/getname/:id',async(req,res)=>{
    try{
         await Seller.find({_id: req.params.id},{firstname:1,lastname:1,_id:0}).then(data=>{
            res.send({
                error : false,
                data : data,
            }
            )
        })
    }catch(err){
        console.log(err);
        res.send({
            error: true,
            msg: err.message,
        });
    }
})

//@desc If seller declines the request of the buyer
//@route  POST /seller/decline

router.post('/decline',async(req,res)=>{
    try{
        let seller = await Seller.findOneAndUpdate(
            {
                _id: req.body.seller,
            },
            {
                $pull: {
                    requestforaddress: req.body.buyer,
                },
            }
        );
        const filter = { _id: req.body.buyer };
        const update = {
            $push: {
                message: "The seller "+seller.firstname+" "+seller.lastname+" declined your request",
            },
        };
        let accept = await Buyer.findOneAndUpdate(filter, update, {
            new: true,
        }).then(
            res.send({
                error: false,
                msg: 'Buyer declined access sucessfully',
            })
        );

    }catch(err){
        console.log(err);
        res.send({
            error: true,
            msg: err.message,
        });
    }
})

module.exports = router;
