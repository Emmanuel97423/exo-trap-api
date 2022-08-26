const express = require('express');
const router = express.Router();
const ProductGammes = require('../models/ProductGammes.model');
const Gammes = require('../models/Gamme.model')

router.get('/', async (req, res, next) => {
    try {
        const allProductsGammes = await ProductGammes.find({});
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
        })
    } catch (error) {
        console.log('error:', error)
        res.status(500).json({ "message": "Une erreur s'est produite", "error": error })
    }
})



module.exports = router;