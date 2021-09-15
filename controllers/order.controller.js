const { CodeCommit } = require("aws-sdk");
const Order = require("../models/Order.model")
const stripe = require("stripe")(process.env.STRIPE_PUBLIC_KEY);


exports.create = (req, res, next) => {

    const orderObject = req.body;
    console.log('orderObject:', orderObject);
    const order = new Order({
        ...orderObject
    });
    order.save().then(() => { res.status(200).json({ message: "commander enregistré avec succé" }) }).catch(err => res.status(500).json({ error: err }))


}

exports.getPaymentSecret = (req, res, next) => {
    const orderObject = req.body;
    stripe.paymentIntents.create({
        amount: orderObject.amount * 100,
        currency: 'eur',
        payment_method_types: ["card"],

    }).then((response) => {
        // console.log('intent', response)
        res.status(200).json({ client_secret: response.client_secret })
    }).catch((error) => { console.log('error', error) })



}