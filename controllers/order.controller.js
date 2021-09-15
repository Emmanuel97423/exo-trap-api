const { CodeCommit } = require("aws-sdk");
const Order = require("../models/Order.model")
const stripe = require("stripe")(process.env.STRIPE_PUBLIC_KEY);


exports.create = async (req, res, next) => {

    const orderObject = req.body;
    const fullName = orderObject.customer.firstName + " " + orderObject.customer.lastName
    // console.log(orderObject)
    const order = new Order({
        ...orderObject
    });
    //charge customer 

    // stripe.confirmCardPayment(
    //     orderObject.clientSecret, {
    //     payment_method: {
    //         card: card,
    //         billing_detail: {
    //             name: fullName,
    //         }
    //     }
    // }
    // ).then((result) => {
    //     if (result.error) {
    //         console.log(result.error.message);
    //     } else if (result.paymentIntent.status === 'succeeded') {
    //         console.log('Charge Ok paiment intent')
    //     }
    // })


    // stripe.paymentIntents.create({
    //     amount: orderObject.amount * 100,
    //     currency: 'eur',
    //     payment_method_types: ["card"],
    //     metadata: { 'Client': fullName },
    //     receipt_email: orderObject.customer.email
    // }).then(() => {
    //     console.log('Charge OK')
    //     order.save().then(() => {
    //         res.status(201).json({ message: "Commande crée avec succée" })
    //     }).catch(err => { res.status(400).json({ message: err }) })
    // }).catch(err => { res.status(400).json({ err }); })



}

exports.getPaymentSecret = async (req, res, next) => {
    const orderObject = req.body;
    // console.log(orderObject)
    // const fullName = orderObject.customer.firstName + " " + orderObject.customer.lastName
    // console.log(orderObject.customer.email)
    // const order = new Order({
    //     ...orderObject
    // });
    //charge customer 

    const intent = await stripe.paymentIntents.create({
        amount: orderObject.amount * 100,
        currency: 'eur',
        // payment_method_types: ["card"],
        // confirm: true,
        // // payment_method: '{{PAYMENT_METHOD_ID}}',
        // payment_method_options: {
        //     card: {
        //         network: 'cartes_bancaires',
        //     },
        // },
        // metadata: { 'Client': fullName },
        // receipt_email: orderObject.customer.email
    });
    console.log("intent", intent);
    res.json({ client_secret: intent.client_secret });

}