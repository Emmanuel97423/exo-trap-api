const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    id: { type: mongoose.Schema.ObjectId, ref:'Order'},
    userId: { type:String, required: false },
    // invoiceCustomer: { type: Object, required: false},
    products: { type: Object, required: false },
    amount: { type: Number, required: false },
    tax: { type: Number, required: false },
    amountTotal: { type: Number, required:false },
    date: { type: String, required: false },
    adresse: { type:String, required: true},
    company: { type:String, required: false},
    country: { type:String, required: true },
    email: { type:String, required: true },
    firstName: { type:String, required: true },
    lastName: { type:String, required: true },
    orderReview:{ type:String, required: false},
    zip: {type:Number, required: false},
    zone: { type:String, required: false}

})

module.exports = mongoose.model("Order", orderSchema)