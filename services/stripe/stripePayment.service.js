const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { Lineitems } = require("./lineItems")
const Order = require("../../models/Order.model");
const Product = require("../../models/Product.model");
const User = require("../../models/User.model")
const dayjs = require('dayjs');
const { sendGridOrderConfirmation } = require("../../utils/email/sendgridEmail")
require('dayjs/locale/fr');




const createCheckoutStripePayment = async (req, res, next) => {
    const products = req.body.products;
    const shippingAdress = req.body.shippingAdress;
    const productsArray = []

    try {
        products.forEach(product => {
            const items = new Lineitems(product);
            productsArray.push(items.productItems())

        });
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'afterpay_clearpay', 'klarna'],
            line_items: productsArray,
            mode: 'payment',

            payment_intent_data: {
                shipping: {
                    name: 'Exo-Trap',
                    address: {
                        line1: shippingAdress.adress,
                        city: shippingAdress.city,
                        state: shippingAdress.region,
                        country: 'FR',
                        postal_code: shippingAdress.zip,
                    },
                },
            },

            success_url: process.env.CLIENT_URL + '/payment/sucess?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: process.env.CLIENT_URL + '/my-account/checkout-1',

        });

        res.status(200).json({ "session": session })
    } catch (error) {

        res.status(500).json({ "error": error })
    }
}

module.exports = { createCheckoutStripePayment }