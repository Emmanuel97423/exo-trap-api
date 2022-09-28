const Order = require("../models/Order.model");
const Product = require("../models/Product.model");
const User = require("../models/User.model");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const dayjs = require('dayjs');
const { createCheckoutStripePayment } = require("../services/stripe/stripePayment.service");
const { sendGridOrderConfirmation } = require("../utils/email/sendgridEmail");
require('dayjs/locale/fr');

const express = require('express');
const router = express.Router();


router.post('/paymentSucess', async (req, res, next) => {
    const stripeSessionId = req.body.data.stripeSessionId;
    const productsOrder = req.body.data.order.products;
    const clientOrder = req.body.data.order;

    Order.findOne({ paymentSessionId: stripeSessionId }, (error, order) => {
        if (error) res.status(500).json({ error: error });
        if (order) {
            res.status(401).json({ message: "La session de commande a expirée..." });
        } else {
            const order = new Order({
                ...clientOrder,
                date: dayjs().locale('fr').format('dddd, D MMMM, YYYY HH:mm'),
                orderNumberId: dayjs().locale('fr').format('MMDDYYHHmm'),
                status: "En attente...",
                paymentSessionId: stripeSessionId
            });

            order.save((error, orderSaveResult) => {
                if (error) res.status(500).json({ error: error });
                if (orderSaveResult) {
                    for (let i = 0; i < productsOrder.length; i++) {
                        let decQuantity = productsOrder[i].orderQuantity;
                        Product.updateOne({ _id: productsOrder[i]._id }, { $inc: { stock: - decQuantity } }, (error, productUpdateOneResult) => {
                            if (error) res.status(500).json({ error: error });
                            if (productUpdateOneResult) {
                                console.log('Décrementation du stock OK:' + productUpdateOneResult.libelle);
                            }
                        })
                    };
                    User.findOne({ _id: clientOrder.userId }, (error, user) => {
                        if (error) res.status(500).json({ error: error });
                        if (user) {
                            sendGridOrderConfirmation(orderSaveResult.orderNumberId, user.email);
                            res.status(200).json({ message: "Commande validée!" });
                        }
                    })
                }
            })
        }
    })
});

module.exports = router;