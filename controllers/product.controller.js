const Product = require("../models/Product.model");

exports.create = (req, res, next) => {
  const productObject = req.body;
  delete req.body._id;
  console.log(req.files[0].transforms[1]);
  const product = new Product({
    ...productObject,
    imageUrl: req.files[0].transforms[1].location,
  });
  product
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};
//GET toutes les sauces
exports.getAll = (req, res, next) => {
  Product.find()
    .then((products) => res.status(200).json(products))
    .catch((error) => res.status(400).json({ error }));
};
