const dotenv = require('dotenv')
const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {
    check,
    validationResult
} = require("express-validator");
const router = express.Router();
const Buyer = require('../models/Buyer.js');
const auth = require('../middleware/auth.js');

// Load config
dotenv.config()

// @desc    SignUp | register
// @route   POST /buyer/register
router.post("/register",
    [
        check("firstname", "Please Enter a Valid Firstname").not().isEmpty(),
        check("lastname", "Please Enter a Valid Lastname").not().isEmpty(),
        check("address", "Please Enter a Valid Address").not().isEmpty(),
        check("email", "Please Enter a Valid E-mail").isEmail(),
        check("password", "Please Enter a Valid Password").isLength({
            min: 8
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                msg: errors
            });
        }

        try {

            let buyer = await Buyer.findOne({
                email: req.body.email
            });
            if (buyer) {
                return res.status(400).json({
                    msg: "User already exists"
                });
            }

            buyer = new Buyer({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                address: req.body.address,
                email: req.body.email,
                password: req.body.password,
                username: "",
                sellerdetail: [],
                liveproduct: [],
                myorder: [],
                whishlist: [],
            });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            buyer.password = hashedPassword;

            const savedBuyer = await buyer.save();
            res.send({
                userid: buyer._id
            });

        } catch (err) {
            console.log(err);
            res.status(500).send({
                msg: err.message
            });
        }
    });

// @desc    SignIn | Login
// @route   POST /buyer/Login
router.post("/login",
    [
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 8
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                msg: errors.errors[0].msg
            });
        }

        try {

            const buyer = await Buyer.findOne({
                email: req.body.email
            });
            if (!buyer) {
                return res.status(400).json({
                    msg: "User is not registered"
                });
            }

            const validPassword = await bcrypt.compare(req.body.password, buyer.password);
            if (!validPassword) {
                return res.status(400).json({
                    msg: "Password is not valid"
                });
            }

            const token = jwt.sign({
                _id: buyer._id
            }, process.env.TOKEN_SECRET);
            res.header('auth-token', token).send({
                'auth-token': token
            });

        } catch (err) {
            console.log(err);
            res.status(500).send({
                msg: err.message
            });
        }
    });

// @desc    Details | Profile, if buyer logged in already else error | buyer auth-token header
// @route   GET /buyer/detail
router.get("/detail", auth, async (req, res) => {
    try {
        const buyer = await Buyer.find(mongoose.Types.ObjectId(req.buyer._id));
        res.send(buyer);
    } catch (err) {
        console.log(err);
        res.status(500).send({
            msg: err.message
        });
    }
});

module.exports = router;