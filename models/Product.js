const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    imagepath: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    formatOfPrice: {
        type: String,
        required: true,
        trim: true
    },
    category:{
        type: Schema.Types.ObjectId,
        ref: 'Categories'
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'Seller'
    },
    available: {
        type: Boolean,
        default: true
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate:{
        type: Date,
        required: true,
    },
    status:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Product", productSchema);