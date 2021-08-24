const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: "User", required: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  company: { type: String, required: false },
  country: { type: String, required: true },
  zone: { type: String, required: true },
  zip: { type: String, required: true },
  adress: { type: String, required: true },
  orders: { type: Object, required: false },
  invoices: { type: Object, required: false },
  email: { type: String, required: true },
  password: { type: String, required: false },
  admin: { type: Boolean, required: false },
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
