const express = require('express');
const router = express.Router();
const ProductGammes = require('../models/ProductGammes.model');
const Gammes = require('../models/Gamme.model')

router.get('/', async (req, res, next) => {
    try {
        const allProductsGammes = await ProductGammes.find({});
        console.log('allProductsGammes:', allProductsGammes)
        res.status(200).json(allProductsGammes)
    } catch (error) {
        console.log('error:', error)
        res.status(500).json({ "message": "Une erreur s'est produite", "error": error });
    };
});
router.get('/gamme/:code', async (req, res, next) => {
    console.log('req:', req.params.code)
    try {
        await Gammes.find({ gammeCode: req.params.code }, (error, result) => {
            if (result) {
                console.log('result:', result)
                res.status(200).json(result)
            } else {
                res.status(404).json({ "message": "Une erreur s'est produite", "error": error })
            }

        })

    } catch (error) {
        res.statut(500).json({ "message": "Une erreur s'est produite", "error": error });
        console.log('error:', error)

    }
});

router.get('/productGamme/:id', async (req, res, next) => {

    try {
        await ProductGammes.findOne({ _id: req.params.id }, (err, product) => {
            if (err) return res.status(400).json({ "message": "Une Erreur s'est produite", "error": err });
            res.status(200).json(product);
            console.log('product:', product)
        })
    } catch (error) {
        console.log('error:', error)
        res.status(500).json({ "message": "Une erreur s'est produite", "error": error })
    }
})

router.get('/search/', async (req, res, next) => {
    console.log("🚀 ~ file: gammes.route.js ~ line 51 ~ router.post ~ req", req.query)


    // try {
    //     const gammes = req.body.gamme.replace('¤', ' ').split(' ');
    //     gammes.map(async (item) => {
    //         // try {
    //         await Gammes.find({ gammeCode: item }, (err, result) => {
    //             if (err) { return res.status(500).json({ "message": "Une Erreur s'est produite", "error": err }); }

    //             console.log('result:', result)
    //         })
    //         // } catch (err) {
    //         //     console.log('err:', err)

    //         // }
    //     })
    // }
    // catch (error) {
    //     console.log('error:', error)
    // }
})

module.exports = router;