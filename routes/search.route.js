const express = require('express');
const router = express.Router();
const ProductGamme = require('../models/ProductGammes.model')
const Product = require('../models/Product.model')



router.get('/filter', async (req, res, next) => {
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

router.get('/filter/subCategory', async (req, res, next) => {
    const productsArrayTemp = [];
    const arrayRequest = req.query.searchArrayByTags
    console.log('arrayRequest:', arrayRequest)
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
                        console.log('products:', products)
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
                                // console.log("🚀 ~ file: search.route.js ~ line 19 ~ Product.find ~ productsArray", productsArray)




                            };
                            indexTemp--
                            if (indexTemp == 0) {
                                console.log('indexTemp:', indexTemp)

                                setTimeout(() => {
                                    resolve(productsArrayTemp);
                                }, 200)
                            }

                        })

                    };


                });
            });


            // for (let i = 0; i < arrayRequest.length; i++) {

            //     ProductGamme.find({ libelleSousFamille: arrayRequest[i] }, (error, products) => {
            //         if (error) res.status(500).json({ error: error });
            //         if (products) {
            //             products.filter(product => {
            //                 productsArrayTemp.push(product);

            //             });
            //             Product.find({ libelleSousFamille: arrayRequest[i] }, (error, singleProduct) => {
            //                 if (error) res.status(500).json({ error: error });
            //                 if (singleProduct) {
            //                     singleProduct.filter(product => {
            //                         if (product.codeGamme === '') {
            //                             console.log('arrayRequest.length - i:', i);
            //                             console.log('arrayRequest.length:', arrayRequest.length - i)
            //                             productsArrayTemp.push(product);
            //                             // resolve('Promise OK');
            //                             if (i == 1) {

            //                                 resolve(productsArrayTemp);
            //                             } else {
            //                                 reject(null)
            //                             }

            //                         }

            //                     })
            //                     // console.log("🚀 ~ file: search.route.js ~ line 19 ~ Product.find ~ productsArray", productsArray)




            //                 }

            //             })

            //         };


            //     });
            //     // console.log('arrayRequest.length:', arrayRequest.length - i)

            //     // console.log('i:', i);


            // }

            // return
            // arrayRequest.map(libelleSousFamille => {
            //     ProductGamme.find({ libelleSousFamille: libelleSousFamille }, (error, products) => {
            //         if (error) res.status(500).json({ error: error });
            //         if (products) {
            //             products.filter(product => {
            //                 productsArray.push(product);

            //             });
            //             Product.find({ libelleSousFamille: libelleSousFamille }, (error, singleProduct) => {
            //                 if (error) res.status(500).json({ error: error });
            //                 if (singleProduct) {
            //                     singleProduct.filter(product => {
            //                         if (product.codeGamme === '') {

            //                             productsArray.push(product);
            //                             resolve('Promise OK')

            //                         }

            //                     })
            //                     // console.log("🚀 ~ file: search.route.js ~ line 19 ~ Product.find ~ productsArray", productsArray)




            //                 }

            //             })

            //         };


            //     });

            // });


        })
        myPromise.then((productsArray) => {
            // console.log('result:', result)
            // console.log('res:', res)
            console.log('productsArray:', productsArray)

            return res.status(200).json({ productsArray })


        }).catch((err) => { console.log('err:', err) })
        // arrayRequest.map(libelleSousFamille => {
        //     ProductGamme.find({ libelleSousFamille: libelleSousFamille }, (error, products) => {
        //         if (error) res.status(500).json({ error: error });
        //         if (products) {
        //             console.log('products:', products)
        //             products.filter(product => {
        //                 productsArray.push(product);

        //             });
        //             Product.find({ libelleSousFamille: libelleSousFamille }, (error, singleProduct) => {
        //                 if (error) res.status(500).json({ error: error });
        //                 if (singleProduct) {
        //                     console.log('singleProduct:', singleProduct)
        //                     singleProduct.filter(product => {
        //                         if (product.codeGamme === '') {

        //                             productsArray.push(product);

        //                         }

        //                     })
        //                     // console.log("🚀 ~ file: search.route.js ~ line 19 ~ Product.find ~ productsArray", productsArray)
        //                     return productsArray



        //                 }

        //             })

        //         };


        //     });

        // });

    }

    // for (let i = 0; i < arrayRequest.length; i++) {
    //     console.log('arrayRequest:', arrayRequest[i])

    // }


    // ProductGamme.find({ codeSousFamille: searchProductBySubCategoryRequest }, (error, products) => {
    //     if (error) res.status(500).json({ error: error });
    //     if (products) {
    //         products.filter(product => {
    //             productsArray.push(product);

    //         });
    //         Product.find({ codeSousFamille: searchProductBySubCategoryRequest }, (error, singleProduct) => {
    //             if (error) res.status(500).json({ error: error });
    //             if (singleProduct) {
    //                 singleProduct.filter(product => {
    //                     if (product.codeGamme === '') {

    //                         productsArray.push(product);

    //                     }

    //                 })
    //                 // console.log("🚀 ~ file: search.route.js ~ line 19 ~ Product.find ~ productsArray", productsArray)

    //                 return res.status(200).json({ productsArray })

    //             }

    //         })

    //     };


    // });


});

module.exports = router;
