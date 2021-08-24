const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    id: { type: mongoose.Schema.ObjectId, ref:'Order'},
    userId: { type:String, required: true },
    products: { type: Object, required: true },
    amount: { type: Number, required: true },
    tax: { type: Number, required: true },
    amountTotal: { type: Number, required: true },
    date: { type: String, required: true },

})

module.exports = mongoose.model("Order", orderSchema)