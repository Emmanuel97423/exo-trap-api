const express = require('express');
const router = express.Router();
const Category = require('../models/Category.model');
const SubCategory = require('../models/SubCategory.model');

router.get('/', async (req, res, next) => {
    Category.find({}, (error, category) => {
        if (error) return res.status(500).json({ status: error });
        if (category) return res.status(200).json({ response: category })
    })
});

router.get('/subCategory/:codeFamille', async (req, res, next) => {
    const codeFamille = req.params.codeFamille
    SubCategory.find({ codeFamille: codeFamille }, (error, subCategory) => {
        if (error) return res.status(500).json({ status: error });
        if (subCategory) return res.status(200).json({ subCategory })
    })
});

module.exports = router;