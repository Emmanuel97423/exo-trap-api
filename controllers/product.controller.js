const Product = require("../models/Product.model");

exports.create = (req, res, next) => {
  const productObject = req.body;
  delete req.body._id;
  console.log(req.files[0].originalname);
  const product = new Product({
    ...productObject,
    imageUrl1: `${req.protocol}://${req.get("host")}/images/${
      req.files[0].filename
    }`,
    imageUrl2: `${req.protocol}://${req.get("host")}/images/${
      req.files[1].filename
    }`,
    imageUrl3: `${req.protocol}://${req.get("host")}/images/${
      req.files[2].filename
    }`,
  });
  product
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};
