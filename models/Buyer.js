const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const buyerSchema = new Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    firstname: {
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    sellerdetail: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Seller',
        },
    ],
    liveproduct: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Order',
        },
    ],
    myorder: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Order',
        },
    ],
    wishlist: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product',
        },
    ],
});

const Buyer = mongoose.model('Buyer', buyerSchema);

module.exports = Buyer;
