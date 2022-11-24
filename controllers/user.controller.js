const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User.model");
const Token = require("../models/Token.model");
const UserConfirmation = require("../models/UserConfirmation.model");
// const auth = require("../middleware/auth");
// const mongoose = require("mongoose");
// const sendEmail = require("../utils/sendEmailConfirmation")
const sendEmailSendgrid = require("../utils/sendgridEmailConfirm");

const { requestResetPassword, resetPassword } = require("../services/auth.service")


const { randomBytes } = require('crypto');


// const md5 = require("md5");

//Signup
exports.signup = (req, res, next) => {


  User.findOne({ email: req.body.email }).then((email) => {
    if (email) {
      return res
        .status(401)
        .json({ message: "Cette adresse email est déjà inscrit" });
    } else {
      bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
          const token = jwt.sign({ email: req.body.email }, 'JWTSecret');
          const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            invoicingDetails: null,
            // userId: req.body.userId,
            email: req.body.email,
            password: hash,
            token: token,
            role: "guest",
            actived:false,
            isValided: false
            // idFile: req.file.transforms[1].location
          });

          user
            .save()
            .then((user) => {
              randomBytes(128, (err, buf) => {
                if (err) throw err;
                console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
                const confirmation = new UserConfirmation({
                  userId: user._id,
                  token: buf.toString('hex'),
                  email: user.email
                });
                confirmation
                  .save()
                  .then((confirmation) => {
                    //Sendrig send email service
                    sendEmailSendgrid(confirmation)
                    // sendEmail(confirmation)
                    res.status(200).json({ message: "Veuillez vérifier votre e-mail afin d'activer votre compte" })
                  })
                  .catch((error) => console.log('Token confirmation ERROR!', error));

              });
            })
            .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));



    }
  });
};
//confirm EMailAddress
exports.confirmEmail = (req, res, next) => {
  UserConfirmation.findOne({ userId: req.params.id }).then((result) => {
    if (result) {
      User.updateOne({ _id: result.userId }, { actived: true }).then(() => {
        UserConfirmation.deleteOne({ userId: req.params.id }).then(() => {
          console.log('supression user confirmation temp')
          res.redirect('https://exo-trap.re/login')
        }).catch(err => { console.log(err) })
      }).catch(err => { console.log(err) })
    }
  })
}
//Login
exports.login = (req, res, next) => {


  User.findOne({ email: req.body.email })
    .then((user) => {

      if (!user) {

        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      } else if (!user.actived) {
        return res.status(401).json({ error: "Veuillez confirmer votre e-mail!" });
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              return res.status(401).json({ error: "Mot de passe incorrect !" });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
                expiresIn: "24h",
              }),
              email: user.email,
              data: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
                expiresIn: "24h",
              }),
            });
            // console.log("User connected")
          })
          .catch((error) => res.status(500).json({ error }));
      }

    })
    .catch((error) => res.status(500).json({ error }));
};
//Logout
exports.logout = (req, res, next) => {
  // console.log(req.body)
  User.findOne({ _id: req.body._id }).then(() => {
    res.status(200).json({
      userId: null,
      token: null
    })
  }).catch((error) => res.status(500).json({ error }))
}
//Get all users
exports.getAllUsers = (req, res, next)=>{
User.find({}, (error, user) => {
  if(error) res.status(500).json({ error: error });
  if(user) res.status(200).json({ user})
})
}
//User details
exports.getOne = (req, res, next) => {

  User.findOne({ _id: req.params.id }).then((user) => {
    res.status(200).json(user);
  }).catch((err) => { res.status(404).json(err) })
}
//User update
exports.update = (req, res, next) => {
  // console.log(req.body)
  const userObject = { ...req.body }
  bcrypt
    .hash(userObject.password, 10).then((hash) => {
      // console.log(hash)
      // console.log(userObject.password)
      User.updateOne({ _id: req.params.id }, {
        ...userObject, password: hash, _id: req.params.id

      }).then(() => res.status(200).json({ message: "Objet modifié !" }))
        .catch((error) => res.status(400).json({ error }));
    }).catch((error) => res.status(500).json({ error }))



}
//User post adress
exports.addInvoicingAdresse = (req, res, next) => {

  const invoiceAdresse = { ...req.body }
  // console.log(invoiceAdresse)
  User.updateOne({ _id: req.body.invoiceUserId }, {
    invoicingDetails: { ...invoiceAdresse }
  }).then((invoicingDetails) => {
    console.log(invoicingDetails)
  }).catch((error) => res.status(500).json({ error }))
}
//Me details
exports.me = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  const userId = decodedToken.userId;

  User.findOne({ _id: userId }).then((user) => {

    try {
      return res.json({
        status: 'success',
        user: {
          token: token,
          userId: userId,
          userObject: user
        }
      })
    } catch (error) { console.error(error) }

  }).catch((error) => { console.log(error) });




  // User.findOne({ _id: req.params.id }).then((user) => {
  //   // console.log(user)
  //   res.status(200).json(user);
  // }).catch((err) => { res.status(404).json(err) })
}

//Reset password
exports.requestResetPassword = async (req, res, next) => {
  requestResetPassword(req, res)
}
exports.resetPassword = async (req, res, next) => {
  resetPassword(req, res)
}

//Update validation
exports.updateValidation = async (req, res, next) => {
  
  const userId = req.params.id;
  const update = req.body.verificationObj;
  User.findOneAndUpdate({_id:userId},{$set:{
    "validationOptions.identityJustificatifRecto": update[0].statusCode,
    "validationOptions.identityJustificatifVerso": update[1].statusCode,
    "validationOptions.adressJustificatif": update[2].statusCode,
     "validationOptions.chassePermisJustificatif": update[3].statusCode,
      "validationOptions.licenceTirJustificatif": update[4].statusCode,
       "validationOptions.licenceTirFftJustificatif": update[5].statusCode,
       "validationOptions.permisChasseFFBTJustificatif": update[6].statusCode,
    
  }},{new:true}, (error, user) => {
    if(error) res.status(500).json({ error: error })
    if(user){
      
      if(user.validationOptions.identityJustificatifRecto===true && 
        user.validationOptions.identityJustificatifVerso===true &&
        user.validationOptions.adressJustificatif===true &&
        user.validationOptions.chassePermisJustificatif===true &&
        user.validationOptions.licenceTirJustificatif === true &&
        user.validationOptions.licenceTirFftJustificatif ===true &&
        user.validationOptions.permisChasseFFBTJustificatif === true
        ) {
          User.findOneAndUpdate({_id: userId},  {isValided:true}, {new:true},(error, user)=>{
            if(error) res.status(500).json({ error: error })
            if(user){
              console.log('user:', user)
            }
          })
        } else {
          User.findOneAndUpdate({_id: userId},  {isValided:false}, {new:true},(error, user)=>{
            if(error) res.status(500).json({ error: error })
            if(user){
              console.log('user:', user)
            }
          })
        }
      return res.status(200).json({ message: "Validation mis à jour"})

    }
  })

}