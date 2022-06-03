const express = require('express');
const router = express.Router();
const orderCtrl = require("../controllers/order.controller");

router.post("/addOrder", orderCtrl.create)
router.post('/paymentSecret', orderCtrl.getPaymentSecret)
router.get("/allOrders/:id", orderCtrl.allOrders)
router.get("/:id", orderCtrl.getOne)
router.post("/create-checkout-session", orderCtrl.stripeCheckout)
router.get("/success", orderCtrl.success)

module.exports = router;