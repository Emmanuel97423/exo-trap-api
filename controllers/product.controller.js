const Product = require("../models/Product.model");
const ProductGammes = require('../models/ProductGammes.model')


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
  console.log("🚀 ~ file: product.controller.js ~ line 28 ~ req.body.isAProductGamme", req.body)
  if (req.body.isAProductGamme === 'true') {
    ProductGammes.findOne({ codeArticleGamme: req.body.codeArticleGamme })
      .then((product) => {
        res.status(200).json(product);
      })
      .catch((err) => res.status(404).json(err));
  } else {
    Product.findOne({ codeArticle: req.body.codeArticle })
      .then((product) => {
        console.log('product:', product)
        res.status(200).json(product);
      })
      .catch((err) => res.status(404).json(err));
  }

  // if (req.body.isAProductGamme) {
  //   Product.findOne({ codeArticle: req.params.id })
  //     .then((product) => {
  //       res.status(200).json(product);
  //     })
  //     .catch((err) => res.status(404).json(err));
  // } else {
  //   Product.findOne({ _id: req.params.id })
  //     .then((product) => {
  //       res.status(200).json(product);
  //     })
  //     .catch((err) => res.status(404).json(err));
  // }


};

//Get product Gammes
// exports.gammes = (req, res, next) => {
//   res.status(200).json({ "message": "Gammes" });
// }
// exports.getAllProductsGammes = (req, res, next) => {
//   console.log('Hello all Product gamme')
//   // res.status(200).json({ "message": "All product gammes" })


//   // try {
//   //   const allProductsGammes = await ProductGammes.find({});
//   //   console.log('allProductsGammes:', allProductsGammes)
//   //   res.status(200).json(allProductsGammes)
//   // } catch (error) {
//   //   console.log('error:', error)
//   //   res.status(500).json({ "message": "Une erreur s'est produite", "error": error });
//   // }
// }
// exports.getOneProductGamme = async (req, res, next) => {
//   try {
//     await ProductGammes.findOne({ _id: req.params.id }, (err, product) => {
//       if (err) return res.status(400).json({ "message": "Une Erreur s'est produite", "error": err });
//       res.status(200).json(product);
//       console.log('product:', product)
//     })
//   } catch (error) {
//     console.log('error:', error)
//     res.status(500).json({ "message": "Une erreur s'est produite", "error": error })
//   }

// }
