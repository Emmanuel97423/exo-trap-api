const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

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
  validationOptions:{ 
    identityJustificatifRecto:{ 
      title:{type:String, required: false},
      status: { type: String, required:false},
      statusCode: {type:Boolean, required:false},
    },
     identityJustificatifVerso:{ 
      title:{type:String, required: false},
      status: { type: String, required:false},
      statusCode: {type:Boolean, required:false},
    },
     adressJustificatif:{ 
      title:{type:String, required: false},
      status: { type: String, required:false},
      statusCode: {type:Boolean, required:false},
    },
     chassePermisJustificatif:{ 
      title:{type:String, required: false},
      status: { type: String, required:false},
      statusCode: {type:Boolean, required:false},
    },
     licenceTirJustificatif:{ 
      title:{type:String, required: false},
      status: { type: String, required:false},
      statusCode: {type:Boolean, required:false},
    },
     licenceTirFftJustificatif:{ 
      title:{type:String, required: false},
      status: { type: String, required:false},
      statusCode: {type:Boolean, required:false},
    },
     PermisChasseJustificatif:{ 
      title:{type:String, required: false},
      status: { type: String, required:false},
      statusCode: {type:Boolean, required:false},
    }
  }
  
},
  {timestamps: true}

);

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
