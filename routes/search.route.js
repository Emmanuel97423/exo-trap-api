const express = require('express');
const router = express.Router();
const ProductGamme = require('../models/ProductGammes.model')
const Product = require('../models/Product.model')



router.get('/filter', async (req, res, next) => {
    const productsArray = [];
    const start = req.query.start
    const size = req.query.size
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
                    const totalProducts = productsArray.length;
                    const sliceProduct = productsArray.slice(0, start);
                    return res.status(200).json({ productsArray: sliceProduct, totalProducts: totalProducts })

                }

            })

        };


    });


});

router.get('/filter/subCategory', async (req, res, next) => {
    const productsArrayTemp = [];
    const arrayRequest = req.query.searchArrayByTags
    const searchProductBySubCategoryRequest = req.query.search;
    //STart Fetch Data
    if (!arrayRequest) {
        return
    } {
        const myPromise = new Promise((resolve, reject) => {
            let indexTemp = arrayRequest.length
            arrayRequest.map((request) => {

                ProductGamme.find({ sousFamilleLibelle: request }, (error, products) => {
                    if (error) res.status(500).json({ error: error });
                    if (products) {
                        products.filter(product => {
                            productsArrayTemp.push(product);

                        });
                        Product.find({ libelleSousFamille: request }, (error, singleProduct) => {
                            if (error) res.status(500).json({ error: error });
                            if (singleProduct) {
                                // console.log('singleProduct:', singleProduct)
                                singleProduct.filter(product => {
                                    if (product.codeGamme === '') {

                                        productsArrayTemp.push(product);




                                    }

                                })

                            };
                            indexTemp--
                            if (indexTemp == 0) {

                                setTimeout(() => {
                                    resolve(productsArrayTemp);
                                }, 200)
                            }

                        })

                    };


                });
            });



        })
        myPromise.then((productsArray) => {
            // console.log('result:', result)
            // console.log('res:', res)

            return res.status(200).json({ productsArray })


        }).catch((err) => { console.log('err:', err) })
       

    }
   
});
router.post('/search/products', async (req, res, next) => {
    const request = req.body.request;
    const productsArray = [];
    Product.find({ "libelle": { "$regex": request, "$options": "i" } }, (error, result) => {
    if(error) res.status(500).json({ error: error });
    if(result){ 
    result.map(product =>{
        if(product.codeGamme == ''){
            productsArray.push(product);
        }   else {
            return;
        } 
    });
            res.status(200).json({productsArray});

}
    })

router.post('/search/productsGamme', async (req, res, next) => {
    const request = req.body.request;
    const productsArray = [];
         ProductGamme.find({ "libelle": { "$regex": request, "$options": "i"}}, (error, productsGammeFind) => {
    if(error) res.status(500).json({ error: error });
    if(productsGammeFind){
        // console.log('productsGammeFind:', productsGammeFind)
        productsGammeFind.map(product =>{
                    productsArray.push(product);
    });
            res.status(200).json({productsArray});

        }
    })
})

})

module.exports = router;
