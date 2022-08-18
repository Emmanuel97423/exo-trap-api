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

router.get('/subCategory', async (req, res, next) => {
    SubCategory.find({}, (error, subCategory) => {
        if (error) return res.status(500).json({ status: error });
        if (subCategory) return res.status(200).json({ response: subCategory })
    })
});

module.exports = router;