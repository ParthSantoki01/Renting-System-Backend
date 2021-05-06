const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    buyerid: {
        type: Schema.Types.ObjectId,
        ref: 'Buyer',
    },
    sellerid: {
        type: Schema.Types.ObjectId,
        ref: 'Seller',
    },
    productid: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
    },
    address: {
        type: String,
        require: true,
    },
    totalprice: {
        type: String,
        require: true,
    },
    paymentid: {
        type: String,
        require: false,
    },
    purchasedate: {
        type: Date,
        default: Date.now,
    },
    returndate: {
        type: Date,
        default: null,
    },
    delivered: {
        type: Boolean,
        default: false,
    },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
