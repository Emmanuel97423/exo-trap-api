const express = require("express");
const router = express.Router();
const productCtrl = require("../controllers/product.controller");
//const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const Product = require('../models/Product.model');
const ConvertGamme = require("../utils/product/convertGammes");


router.get("/search/:codeGamme", async (req, res, next) => {
    await Product.find({ codeGamme: req.params.codeGamme }, (err, result) => {
        if (err) { res.status(500).json({ "message": "Une erreur s'est produite", "error": err }) }
        res.status(200).json(result)
        result.map((product) => {
            const gammeConvert = new ConvertGamme(product)
            gammeConvert.getFinalProduct
            // const gammeArray = gammeConvert.getSplitGammes
            // const gammeValueArray = gammeConvert.getSplitGammesValue
            // const combineGammes = gammeConvert.getCombineGammes
            // console.log('combineGammes:', combineGammes)


        })

    })

});

router.post("/addProduct", auth, upload.array("image", 3), productCtrl.create);
router.get("/allProduct", productCtrl.getAll);
router.get("/:id", productCtrl.getOne);


//Gammes routes
// router.get("/allProductsGammes", productCtrl.getAllProductsGammes);
// router.get("/productGammes/:id", productCtrl.getOneProductGamme);

// router.get("/gammes", productCtrl.gammes);

module.exports = router;
