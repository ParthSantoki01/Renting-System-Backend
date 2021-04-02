const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const schema = new Schema({
    buyerid : {type : Schema.Types.ObjectId, ref : 'Buyer'},
    sellerid : {type : Schema.Types.ObjectId, ref : 'Seller'},
    productid  :[{type : Schema.Types.ObjectId,ref : 'Product'}],
    address : {type : String,require : true},
    totalPrice : {type: Number,require : true},
    paymentid : {type : String,require : false},
    purchaseDate : {type : Date, default : Date.now},
    returnDate : {type : Date, default : null},
    delivered : {type : Boolean, default : false}
});

module.exports = Mongoose.model('Order',schema);