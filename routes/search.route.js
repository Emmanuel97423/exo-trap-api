const express = require('express');
const router = express.Router();
const ProductGamme = require('../models/ProductGammes.model')
const Product = require('../models/Product.model')



router.get('/filter', async (req, res, next) => {
    console.log('req:', req)
    const productsArray = [];

    const searchProductByCategoryRequest = req.query.search;
    ProductGamme.find({ codeFamille: searchProductByCategoryRequest }, (error, products) => {
        if (error) res.status(500).json({ error: error });
        if (products) {
            products.filter(product => {
                productsArray.push(product);

            });
            Product.find({ codeFamille: searchProductByCategoryRequest }, (error, singleProduct) => {
                if (error) res.status(500).json({ error: error });
                if (singleProduct) {
                    singleProduct.filter(product => {
                        if (product.codeGamme === '') {

                            productsArray.push(product);

                        }

                    })
                    // console.log("🚀 ~ file: search.route.js ~ line 19 ~ Product.find ~ productsArray", productsArray)

                    return res.status(200).json({ productsArray })

                }

            })

        };


    });


});

module.exports = router;
