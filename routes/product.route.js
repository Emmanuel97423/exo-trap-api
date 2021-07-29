const express = require("express");
const router = express.Router();
const productCtrl = require("../controllers/product.controller");
const multer = require("../middleware/multer-config");

router.post("/addProduct", multer, productCtrl.create);

module.exports = router;
