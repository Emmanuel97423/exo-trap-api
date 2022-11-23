const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// const justificatifSchema = mongoose.Schema(
//   {
//     title:{type:String, required: false},
//       status: { type: String, default: 'unValided', required:false},
//       statusCode: {type:Boolean, default: 0, required:false},
//     }
// )

// const validationSchema = mongoose.Schema({
//  identityJustificatifRecto: { type: justificatifSchema, required:true },
//      identityJustificatifVerso:{ type: justificatifSchema, required:true },
//      adressJustificatif:{ type: justificatifSchema, required:true },
//      chassePermisJustificatif:{ type: justificatifSchema, required:true },
//      licenceTirJustificatif:{ type: justificatifSchema, required:true },
//      licenceTirFftJustificatif:{ type: justificatifSchema, required:true },
//      PermisChasseJustificatif:{ type: justificatifSchema, required:true }
// })

const userSchema = mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  firstName: { type: String, required: true },
  lastName: { type: String, required: false },

  invoicingDetails: {
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    email: { type: String, required: false },
    company: { type: String, required: false },
    country: { type: String, required: false },
    zone: { type: String, required: false },
    zip: { type: String, required: false },
    adresse: { type: String, required: false },

  },
  orders: { type: Array, ref: 'Orders', required: false },
  invoices: { type: Array, ref: 'Invoices', required: false },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  idFile: { type: String, required: false },
  actived: { type: Boolean, default: true },
  isValided:{ type: Boolean, required: true},
  token: { type: String, required: true },
  stripeId: { type: String, required: false },
  role: { type: String, required: true },
  validationOptions: {
    identityJustificatifRecto:{type:Boolean, default: false, required: true},
    identityJustificatifVerso:{type:Boolean, default: false, required: true},
    adressJustificatif: {type:Boolean, default: false, required: true},
    chassePermisJustificatif:{type:Boolean, default: false, required: true},
    licenceTirJustificatif:{type:Boolean, default: false, required: true},
    licenceTirFftJustificatif:{type:Boolean, default: false, required: true},
    PermisChasseFFBTJustificatif:{type:Boolean, default: false, required: true},


  }
  
},
  {timestamps: true}

);

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
