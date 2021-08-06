const express = require("express");
const router = express.Router();
const productCtrl = require("../controllers/product.controller");
//const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/addProduct", auth, upload.array("image", 3), productCtrl.create);
router.get("/allProduct", productCtrl.getAll);
router.get("/:id", productCtrl.getOne);

module.exports = router;
