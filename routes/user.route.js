const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user.controller");
const upload = require("../middleware/upload");

router.post("/login", userCtrl.login);
router.post("/signup", upload.single("idFile"), userCtrl.signup);

module.exports = router;
