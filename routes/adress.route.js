const express = require('express');
const router = express.Router();
const adressCtrl = require("../controllers/adress.controller");

router.post("/addAdress", adressCtrl.create)
router.get("/getAdresses/:id", adressCtrl.getAdresses)
// router.put("/updateAdress", adressCtrl.update)


module.exports = router;