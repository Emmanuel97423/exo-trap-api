const express = require('express');
const router = express.Router();
const orderCtrl = require("../controllers/order.controller");

router.post("/addOrder", orderCtrl.create )

module.exports = router;