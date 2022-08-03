// const { CodeCommit } = require("aws-sdk");
const Order = require("../models/Order.model");
const Product = require("../models/Product.model");
const stripe = require("stripe")(process.env.STRIPE_PUBLIC_KEY);
const dayjs = require('dayjs');
// const sendEmailOrder = require('../utils/sendEmailOrder')
const { createCheckoutStripePayment } = require("../services/stripe/stripePayment.service");
require('dayjs/locale/fr');

// const initialName = require('../utils/initialName')


//Create order

exports.create = (req, res, next) => {
    const orderObject = req.body;
    // console.log('orderObject:', orderObject)
    // const initial = initialName(orderObject.customer.lastName, orderObject.customer.firstName)

    const order = new Order({
        ...orderObject,
        date: dayjs().locale('fr').format('dddd, D MMMM, YYYY HH:mm'),
        orderNumberId: dayjs().locale('fr').format('MMDDYYHHmm'),
    });
    order.save().then(() => {
        const products = orderObject.products
        // sendEmailOrder(orderObject.products)
        // console.log('product:', products)
        for (const product of products) {
            let decQuantity = product.orderQuantity
            Product.updateOne({ _id: product._id }, { $inc: { quantity: - decQuantity } })
                .then(() => {
                    console.log('Décrementation du stock OK')
                }).catch(err => console.log('Error:', err))
        };



    }).catch((err) => { console.log(err) });




}

exports.getPaymentSecret = (req, res, next) => {
    const orderObject = req.body;
    console.log("🚀 ~ file: order.controller.js ~ line 48 ~ orderObject", orderObject)
    stripe.paymentIntents.create({
        amount: Math.round(orderObject.amount * 100),
        currency: 'eur',
        payment_method_types: ["card"],

    }).then((response) => {
        // console.log('intent', response)
        res.status(200).json({ client_secret: response.client_secret })
    }).catch((error) => { console.log('error', error) })



}

exports.allOrders = (req, res, next) => {

    Order.find({ userId: req.params.id }).then((orders) => {
        res.status(200).json({ orders: orders })
    }).catch((error) => { res.status(404).json({ message: 'Pas de commandes' }) })
}

exports.getOne = (req, res, next) => {
    console.log(req.params.id)
    Order.findOne({ _id: req.params.id }).then((order) => {
        res.status(200).json(order)
    }).catch((error) => { res.status(404).json({ message: 'Pas de commande' }) })
}

exports.stripeCheckout = async (req, res, next) => {
    createCheckoutStripePayment(req, res)
}




