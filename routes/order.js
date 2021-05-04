const express = require('express');
const Order = require('../models/Order');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// @desc    System POST a order
// @route   POST /order
router.post(
    '/',
    [
        check('address', 'Please Enter a Valid Address').not().isEmpty(),
        check('totalprice', 'Please Enter a Valid Price').not().isEmpty(),
        check('paymentid', 'Please Enter a Valid Payment ID').not().isEmpty(),
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
            const order = new Order({
                buyerid: req.body.buyerid,
                sellerid: req.body.sellerid,
                productid: req.body.productid,
                address: req.body.address,
                totalprice: req.body.price,
                paymentid: req.body.paymentid,
                returndate: req.body.returndate,
            });
            const ordersaved = await order.save();
            res.send({
                error: false,
                msg: 'Succsessfully Order Placed',
                orderid: ordersaved._id,
            });
        } catch (err) {
            console.error(err);
            res.send({
                error: true,
                msg: err.message,
            });
        }
    }
);

// @desc    Get a Order using id
// @route   GET /order/:id
router.get('/:id', async (req, res) => {
    try {
        let order = await Order.findById(req.params.id);
        if (!order) {
            return res.send({
                error: true,
                msg: 'Order not found',
            });
        }
        res.send({
            error: false,
            order: order,
        });
    } catch (err) {
        console.error(err);
        res.send({
            error: true,
            msg: err.message,
        });
    }
});

// @desc    Buyer get a Order using his/her buyerid
// @route   GET /order/buyer/:buyerid
router.get('/buyer/:buyerid', async (request, response) => {
    try {
        let orders = await Order.find({
            buyerid: {
                $eq: request.params.buyerid,
            },
        });
        if (!orders) {
            return res.send({
                error: true,
                msg: 'Orders not found',
            });
        }
        response.send({
            error: false,
            orders: orders,
        });
    } catch (error) {
        console.error(err);
        response.send({
            error: true,
            msg: err.message,
        });
    }
});

// @desc    Seller get a Order using his/her sellerid
// @route   GET /order/seller/:sellerid
router.get('/seller/:sellerid', async (request, response) => {
    try {
        let orders = await Order.find({
            sellerid: {
                $eq: request.params.sellerid,
            },
        });
        if (!orders) {
            return res.send({
                error: true,
                msg: 'Orders not found',
            });
        }
        response.send({
            error: false,
            orders: orders,
        });
    } catch (error) {
        console.error(err);
        response.send({
            error: true,
            msg: err.message,
        });
    }
});

// @desc    System get all orders
// @route   GET /order
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find({});
        res.send({
            error: false,
            orders: orders,
        });
    } catch (err) {
        console.error(err);
        res.send({
            error: true,
            msg: err.message,
        });
    }
});

module.exports = router;
