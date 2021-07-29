const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: "User", required: false },
  email: { type: String, required: true },
  password: { type: String, required: true },
  admin: { type: Boolean, required: false },
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
