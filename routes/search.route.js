const express = require('express');
const router = express.Router();
const ProductGamme = require('../models/ProductGammes.model')

router.get('/filter', async (req, res, next) => {
    console.log("🚀 ~ file: gammes.route.js ~ line 51 ~ router.post ~ req", req.query);
    const searchProductByCategoryRequest = req.query.search
    ProductGamme.find({ codeFamille: searchProductByCategoryRequest }, (error, products) => {
        if (error) return res.status(500).json({ error: error });
        if (products) return res.status(200).json({ products })
    })

});

module.exports = router;
