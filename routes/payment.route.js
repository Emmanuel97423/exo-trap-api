const Order = require("../models/Order.model");
const Product = require("../models/Product.model");
const User = require("../models/User.model");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const dayjs = require('dayjs');
// const sendEmailOrder = require('../utils/sendEmailOrder')
const { createCheckoutStripePayment } = require("../services/stripe/stripePayment.service");
const { sendGridOrderConfirmation } = require("../utils/email/sendgridEmail")
require('dayjs/locale/fr');

const express = require('express');
const router = express.Router();


router.post('/paymentSucess', async (req, res, next) => {
    const stripeSessionId = req.body.data.stripeSessionId;
    const productsOrder = req.body.data.order.products;
    const clientOrder = req.body.data.order
    const amountOrder = req.body.data.amount
    const orderPosted = req.body.data;
    // console.log('productsOrder:', productsOrder[0]._id)

    // console.log('req:', req.query)
    // const session = await stripe.checkout.sessions.retrieve(req.params.stripeSessionId);

    // console.log('session:', session.status)
    // if (session.status === "complete") {
    //   res.status(200).json({ status: customer })
    // }
    // const customer = await stripe.customers.retrieve(session.customer);
    // res.status(200).json({ status: session });

    Order.findOne({ paymentSessionId: stripeSessionId }, (error, order) => {
        if (error) res.status(500).json({ error: error });
        if (order) {
            res.status(200).json({ message: "la session de commande à expirer" })
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
                    if (productsOrder.length > 1) {
                        productsOrder.forEach(product => {
                            let decQuantity = product.orderQuantity;
                            Product.updateOne({ _id: product._id }, { $inc: { stock: - decQuantity } }, (error, productUpdateOneResult) => {
                                if (error) res.status(500).json({ error: error })
                                if (productUpdateOneResult) {
                                    console.log('Décrementation du stock OK:' + productUpdateOneResult.libelle);
                                    User.findOne({ _id: clientOrder.userId }, (error, user) => {
                                        if (error) res.status(500).json({ error: error })
                                        if (user) {
                                            console.log('user:', user)
                                            sendGridOrderConfirmation(orderSaveResult.orderNumberId, user.email)

                                        }
                                    })

                                }
                            })

                        })
                    } else {
                        let decQuantity = productsOrder[0].orderQuantity;
                        Product.updateOne({ _id: productsOrder[0]._id }, { $inc: { stock: - decQuantity } }, (error, product) => {
                            if (error) res.status(500).json({ error: error })
                            if (product) {

                                console.log('Décrementation du stock OK:' + productsOrder[0].libelle);
                                User.findOne({ _id: orderPosted.order.userId }, (error, user) => {
                                    if (error) res.status(500).json({ error: error })
                                    if (user) {
                                        console.log('user:', user)
                                        sendGridOrderConfirmation(order.orderNumberId, user.email)

                                    }
                                })

                            }
                        })


                    }

                }
            })
            return

            order.save().then((order) => {
                // console.log("🚀 ~ file: order.controller.js ~ line 48 ~ order.save ~ order", order)
                const orderId = order.orderNumberId
                // const products = orderObject.products
                // sendEmailOrder(orderObject.products)
                // console.log('product:', products)
                for (const product of productsOrder) {
                    let decQuantity = product.orderQuantity
                    Product.updateOne({ _id: product._id }, { $inc: { stock: - decQuantity } })
                        .then((res) => {
                            console.log('Décrementation du stock OK:' + product.libelle);
                            User.findOne({ _id: orderObject.userId }).then((res) => {
                                // console.log("🚀 ~ file: order.controller.js ~ line 39 ~ User.findOne ~ res", res)
                                sendGridOrderConfirmation(orderId, res.email)
                            }).catch((err) => { res.status(404).json(err) })

                        }).catch(err => console.log('Error:', err))
                };



            }).catch((err) => { console.log(err) });
        }
    })

});

module.exports = router;