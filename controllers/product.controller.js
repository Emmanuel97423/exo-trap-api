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
//GET tous les articles
exports.getAll = (req, res, next) => {
  Product.find()
    .then((products) => res.status(200).json(products))
    .catch((error) => res.status(400).json({ error }));
};
//GET un article
exports.getOne = (req, res, next) => {
  console.log(req.params.id)
  Product.findOne({ _id: req.params.id })
    .then((product) => {
      res.status(200).json(product);
    })
    .catch((err) => res.status(404).json(err));
};
