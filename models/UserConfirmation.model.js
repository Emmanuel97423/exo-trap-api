const mongoose = require("mongoose");

const confirmationSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.ObjectId, ref: "User" },
    token: { type: String, required: true },
    email: { type: String, required: true },
})

module.exports = mongoose.model("UserConfirmation", confirmationSchema);