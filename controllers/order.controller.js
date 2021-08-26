const Order = require("../models/Order.model")
const stripe = require("stripe")(process.env.STRIPE_PUBLIC_KEY);

exports.create = (req, res, next) => {
    const orderObject = req.body;
    console.log(orderObject.token)
    const order = new Order({
        ...orderObject
    });

    //charge customer 
    stripe.charges.create({
        amount: parseFloat(orderObject.amount * 100).toFixed(0),
        currency: 'eur',
        description: `Commande ${new Date()} par ${orderObject.customer.firstName} ${orderObject.customer.lastName} `,
        source: orderObject.token.id,
    }).then(() => {
        console.log('Charge OK')

        order.save().then(() => {
            res.status(201).json({ message: "Commande crée avec succée" })


        }).catch(err => { res.status(400).json({ message: err }) })

    }).catch(err => { console.log('Charge Error: ' + err) })



}