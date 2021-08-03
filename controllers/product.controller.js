const Product = require("../models/Product.model");

exports.create = (req, res, next) => {
  const productObject = req.body;
  delete req.body._id;

  const product = new Product({
    ...productObject,
    imageUrl: req.file.location,
  });
  product
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};
