const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        expires: '1m',// this is the expiry time in seconds
        default: Date.now,

    },
});
module.exports = mongoose.model("Token", tokenSchema);