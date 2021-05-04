const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const Buyer = require('../models/Buyer.js');
const Seller = require('../models/Seller.js');
const authbuyer = require('../middleware/authbuyer.js');
const Product = require('../models/Product.js');

// Load config
dotenv.config();

// @desc    SignUp | register
// @route   POST /buyer/register
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
            let buyer = await Buyer.findOne({
                email: req.body.email,
            });
            if (buyer) {
                return res.send({
                    error: true,
                    msg: 'User already exists',
                });
            }

            buyer = new Buyer({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                address: req.body.address,
                email: req.body.email,
                password: req.body.password,
                username: '',
                sellerdetail: [],
                liveproduct: [],
                myorder: [],
                wishlist: [],
            });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            buyer.password = hashedPassword;

            const savedBuyer = await buyer.save();
            res.send({
                error: false,
                userid: buyer._id,
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
// @route   POST /buyer/Login
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
            const buyer = await Buyer.findOne({
                email: req.body.email,
            });
            if (!buyer) {
                return res.send({
                    error: true,
                    msg: 'User is not registered',
                });
            }

            const validPassword = await bcrypt.compare(
                req.body.password,
                buyer.password
            );
            if (!validPassword) {
                return res.send({
                    error: true,
                    msg: 'Password is not valid',
                });
            }

            const token = jwt.sign(
                {
                    _id: buyer._id,
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

// @desc    Details | Profile, if buyer logged in already else error | buyer auth-token header
// @route   GET /buyer/detail
router.get('/detail', authbuyer, async (req, res) => {
    try {
        const buyer = await Buyer.find(mongoose.Types.ObjectId(req.buyer._id));
        res.send({
            error: false,
            buyer: buyer,
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
// @route   GET /buyer/forgot
router.post('/forgot', authbuyer, async (req, res) => {
    try {
        const buyer = await Buyer.find(mongoose.Types.ObjectId(req.buyer._id));
        if (!buyer) {
            return res.send({
                error: true,
                msg: 'Enter a valid email',
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        buyer.password = hashedPassword;
        await buyer.save();
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

// @desc    Add Order to MyOrder on clicking on 'Buy Now' button
// @route   GET /buyer/updatemyorder
router.get('/updatemyorder', async (req, res) => {
    try {
        const update = {
            $addToSet: {
                myorder: req.body.orderid,
            },
        };
        Buyer.findOneAndUpdate({ _id: req.body.buyer }, update, {
            new: true,
            runValidators: true,
        }).then(
            res.send({
                error: false,
                msg: 'Added to MyOrders',
            })
        );
    } catch (error) {
        console.log(error);
        res.send({
            error: true,
            msg: error.message,
        });
    }
});

// @desc    Add Order to Wishlist on clicking on 'Add to Wishlist' button
// @route   GET /buyer/updateWishlist
router.get('/updateWishlist', async (req, res) => {
    try {
        const update = {
            $addToSet: {
                wishlist: req.body.product_id,
            },
        };
        await Buyer.findOneAndUpdate({ _id: req.body.buyer }, update, {
            new: true,
            runValidators: true,
        }).then(
            res.send({
                error: false,
                msg: 'Added to wishlist',
            })
        );
    } catch (error) {
        console.log(error);
        res.send({
            error: true,
            msg: error.message,
        });
    }
});

// @desc    Request address
// @route   post /buyer/request
router.post('/request', async (req, res) => {
    try {
        const filter = { _id: req.body.seller };
        const update = {
            $addToSet: {
                requestforaddress: req.body.buyer,
            },
        };

        let seller = await Seller.findOneAndUpdate(filter, update, {
            new: false,
        }).then(
            res.send({
                error: false,
                msg: 'Request Send to Seller',
            })
        );
    } catch (err) {
        console.log(error);
        res.send({
            error: true,
            msg: error.message,
        });
    }
});

// @desc    Show all address
// @route   post /buyer/address
router.get('/address', async (req, res) => {
    try {
        let buyer = await Buyer.findById(req.body.buyer);
        await Seller.find(
            { _id: buyer.sellerdetail },
            { firstname: 1, lastname: 1, address: 1, _id: 0 }
        ).then((data) => {
            res.send({
                error: false,
                data: data,
            });
        });
    } catch (err) {
        console.log(error);
        res.send({
            error: true,
            msg: error.message,
        });
    }
});
// @desc    Add item to Wishlist on clicking on 'Add to Wishlist' button
// @route   GET /buyer/getwishlist

router.get('/getwishlist', async (req,res)=> {
    try {
        const buyer = await Buyer.findById(req.body.userid)
        if (buyer.wishlist === null)
        {
            return res.send("No items in the Wishlist")
        }
        console.log("Showing Wishlist")
        res.send(buyer.wishlist)
    } catch (error) {
        console.error(error)
		response.status(500).send({
		msg: error.message
    });
    }
});

module.exports = router;
