// const { CodeCommit } = require("aws-sdk");
const Order = require("../models/Order.model")
const stripe = require("stripe")(process.env.STRIPE_PUBLIC_KEY);
const dayjs = require('dayjs')
require('dayjs/locale/fr')

const initialName = require('../utils/initialName')




exports.create = (req, res, next) => {
    const orderObject = req.body;
    console.log('orderObject:', orderObject)
    const initial = initialName(orderObject.customer.lastName, orderObject.customer.firstName)
    console.log('initial:', initial)

    const order = new Order({
        ...orderObject,
        date: dayjs().locale('fr').format('dddd, D MMMM, YYYY HH:mm'),
        orderNumberId: initial + dayjs().locale('fr').format('MMDDYYHHmm'),
    });
    order.save().then(() => { res.status(200).json({ message: "commander enregistré avec succé" }) }).catch(err => res.status(500).json({ error: err }))


}

exports.getPaymentSecret = (req, res, next) => {
    const orderObject = req.body;
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