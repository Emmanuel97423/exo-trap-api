const express = require('express');
const router = express.Router();
const orderCtrl = require("../controllers/order.controller");

router.post("/addOrder", orderCtrl.create)
router.post('/paymentSecret', orderCtrl.getPaymentSecret)

module.exports = router;