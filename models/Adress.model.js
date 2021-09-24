const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const adressSchema = mongoose.Schema({
    userId: { type: String, required: true, ref: 'User' },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    email: { type: String, required: false },
    company: { type: String, required: false },
    country: { type: String, required: false },
    zone: { type: String, required: false },
    zip: { type: String, required: false },
    adress: { type: String, required: false },


});

adressSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Adress", adressSchema);
