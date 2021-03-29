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
const Seller = require('../models/Seller.js');
const authseller = require('../middleware/authseller.js');

// Load config
dotenv.config()

// @desc    SignUp | register
// @route   POST /seller/register
router.post("/register",
    [
        check("firstname", "Please Enter a Valid Firstname").not().isEmpty(),
        check("lastname", "Please Enter a Valid Lastname").not().isEmpty(),
        check("address", "Please Enter a Valid Address").not().isEmpty(),
        check("email", "Please Enter a Valid E-mail").isEmail(),
        check("password", "Please Enter a Valid Password").isLength({
            min: 8
        }),
        check("idproof", "Please Enter a Id-Proof").not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                msg: errors.errors[0].msg
            });
        }

        try {

            let seller = await Seller.findOne({
                email: req.body.email
            });
            if (seller) {
                return res.status(400).json({
                    msg: "User already exists"
                });
            }

            seller = new Seller({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                address: req.body.address,
                email: req.body.email,
                password: req.body.password,
                username: "",
                idproof:req.body.idproof,
                requestforaddress: [],
                productlist: [],
                myorder: [],
            });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            seller.password = hashedPassword;

            const savedSeller = await seller.save();
            res.send({
                userid: seller._id
            });

        } catch (err) {
            console.log(err);
            res.status(500).send({
                msg: err.message
            });
        }
    });

// @desc    SignIn | Login
// @route   POST /seller/Login
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

            const seller = await Seller.findOne({
                email: req.body.email
            });
            if (!seller) {
                return res.status(400).json({
                    msg: "User is not registered"
                });
            }

            const validPassword = await bcrypt.compare(req.body.password, seller.password);
            if (!validPassword) {
                return res.status(400).json({
                    msg: "Password is not valid"
                });
            }

            const token = jwt.sign({
                _id: seller._id
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

// @desc    Details | Profile, if Seller logged in already else error | Seller auth-token header
// @route   GET /Seller/detail
router.get("/detail", authseller, async (req, res) => {
    try {
        const seller = await Seller.find(mongoose.Types.ObjectId(req.seller._id));
        res.send(seller);
    } catch (err) {
        console.log(err);
        res.status(500).send({
            msg: err.message
        });
    }
});

module.exports = router;