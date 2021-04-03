const express = require('express')
const Order = require('../models/Order')
const router = express.Router()
const {
	check,
	validationResult
} = require("express-validator");

// @desc    System POST a order
// @route   POST /order
router.post('/',
	[
		check("address", "Please Enter a Valid Address").not().isEmpty(),
		check("totalprice", "Please Enter a Valid Price").not().isEmpty(),
		check("paymentid", "Please Enter a Valid Payment ID").not().isEmpty()
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).send({
				msg: errors.errors[0].msg
			});
		}
		try {
			const order = new Order({
				buyerid: null,
				sellerid: null,
				productid: [],
				address: req.body.address,
				totalprice: req.body.price,
				paymentid: req.body.paymentid,
			});
			const ordersaved = await order.save()
			res.send({
				msg: "Succsess",
				product: ordersaved
			});
		} catch (err) {
			console.error(err)
			res.status(500).send({
				msg: err.message
			});
		}
	}
)

// @desc    Buyer & Seller get a Order using id
// @route   GET /order/:id
router.get('/:id', async (req, res) => {
	try {
		let order = await Order.findById(req.params.id);
		if (!order) {
			return res.status(404).send({
				msg: "Order not found"
			});
		}
		res.send(order)
	} catch (err) {
		console.error(err)
		res.status(500).send({
			msg: err.message
		});
	}
})

// @desc    Buyer get a Order using his/her buyerid
// @route   GET /order/buyer/:buyerid
router.get("/buyer/:buyerid", async (request, response) => {
	try {
		let orders = await Order.find({
			buyerid: {
				$eq: request.params.buyerid
			}
		});
		if (!orders) {
			return res.status(404).send({
				msg: "Orders not found"
			});
		}
		response.send(orders);
	} catch (error) {
		console.error(err)
		response.status(500).send({
			msg: err.message
		});
	}
});

// @desc    Seller get a Order using his/her sellerid
// @route   GET /order/seller/:sellerid
router.get("/seller/:sellerid", async (request, response) => {
	try {
		let orders = await Order.find({
			sellerid: {
				$eq: request.params.sellerid
			}
		});
		if (!orders) {
			return res.status(404).send({
				msg: "Orders not found"
			});
		}
		response.send(orders);
	} catch (error) {
		console.error(err)
		response.status(500).send({
			msg: err.message
		});
	}
});

// @desc    System get all orders
// @route   GET /order
router.get('/', async (req, res) => {
	try {
		const orders = await Order.find({})
		res.send(orders)
	} catch (err) {
		console.error(err)
		res.status(500).send({
			msg: err.message
		});
	}
})

module.exports = router;