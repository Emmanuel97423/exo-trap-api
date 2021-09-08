const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User.model");

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
          const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,

            // userId: req.body.userId,
            email: req.body.email,
            password: hash,
            idFile: req.file.transforms[1].location
          });
          user
            .save()
            .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
            .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
    }
  });
};

//Login
exports.login = (req, res, next) => {

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {

        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
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
            email: user.email
          });
          // console.log("User connected")
        })
        .catch((error) => res.status(500).json({ error }));
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

//User details
exports.getOne = (req, res, next) => {
  console.log(req.params)

  User.findOne({ _id: req.params.id }).then((user) => {
    console.log(user)
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
  console.log(invoiceAdresse)
  User.updateOne({ _id: req.body.invoiceUserId }, {
    invoicingDetails: { ...invoiceAdresse }
  }).then((user) => {
    console.log(user)
  }).catch((error) => res.status(500).json({ error }))
}