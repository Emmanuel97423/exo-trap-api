const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    customer: {
        userId: { type: String, required: false },
        adresse: { type: String, required: true },
        company: { type: String, required: false },
        country: { type: String, required: true },
        email: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        orderReview: { type: String, required: false },
        zip: { type: Number, required: false },
        zone: { type: String, required: false }
    },
    products: { type: Array, required: true },
    amount:
        { type: Number, required: true },
    // amount: { type: Number, required: false },
    // tax: { type: Number, required: false },
    // amountTotal: { type: Number, required: false },
    date: { type: String, required: false },

})

module.exports = mongoose.model("Order", orderSchema)