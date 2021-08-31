const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({

  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  company: { type: String, required: false },
  country: { type: String, required: false },
  zone: { type: String, required: false },
  zip: { type: String, required: false },
  adress: { type: String, required: false },
  orders: { type: Array, ref: 'Orders', required: false },
  invoices: { type: Array, ref: 'Invoices', required: false },
  email: { type: String, required: true },
  password: { type: String, required: false },
  admin: { type: Boolean, required: false },
  idFile: { type: String, required: false }
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
