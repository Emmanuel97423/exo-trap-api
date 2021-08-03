const express = require("express");
const router = express.Router();
const productCtrl = require("../controllers/product.controller");
//const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");

router.post("/addProduct", auth, productCtrl.create);

module.exports = router;
