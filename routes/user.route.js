const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user.controller");
const upload = require("../middleware/upload");

router.post("/login", userCtrl.login);
router.post("/signup", upload.single("idFile"), userCtrl.signup);
router.post("/logout", userCtrl.logout);
router.get("/:id", userCtrl.getOne);
router.put("/update/:id", userCtrl.update)
router.put("/addInvoicingAdresse/:id", userCtrl.addInvoicingAdresse)

module.exports = router;
