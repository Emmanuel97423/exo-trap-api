const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    customer: {

        adresse: { type: String, required: false },
        company: { type: String, required: false },
        country: { type: String, required: false },
        email: { type: String, required: false },
        firstName: { type: String, required: false },
        lastName: { type: String, required: false },
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
    orderNumberId: { type: String, required: false },
    status: { type: String, required: true }

})

module.exports = mongoose.model("Order", orderSchema)