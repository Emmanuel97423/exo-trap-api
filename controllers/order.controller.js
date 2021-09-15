const { CodeCommit } = require("aws-sdk");
const Order = require("../models/Order.model")
const stripe = require("stripe")(process.env.STRIPE_PUBLIC_KEY);


exports.create = (req, res, next) => {

    const orderObject = req.body;
    console.log('orderObject:', orderObject);
    // const fullName = orderObject.customer.firstName + " " + orderObject.customer.lastName
    // console.log(orderObject)
    const order = new Order({
        ...orderObject
    });
    order.save().then(() => { res.status(200).json({ message: "commander enregistré avec succé" }) }).catch(err => res.status(500).json({ error: err }))


}

exports.getPaymentSecret = (req, res, next) => {
    const orderObject = req.body;
    // console.log(orderObject)
    // const fullName = orderObject.customer.firstName + " " + orderObject.customer.lastName
    // console.log(orderObject.customer.email)
    // const order = new Order({
    //     ...orderObject
    // });
    //charge customer 


    stripe.paymentIntents.create({
        amount: orderObject.amount * 100,
        currency: 'eur',
        payment_method_types: ["card"],
        // confirm: true,
        // // payment_method: '{{PAYMENT_METHOD_ID}}',
        // payment_method_options: {
        //     card: {
        //         network: 'cartes_bancaires',
        //     },
        // },
        // metadata: { 'Client': fullName },
        // receipt_email: orderObject.customer.email
    }).then((response) => {
        // console.log('intent', response)
        res.status(200).json({ client_secret: response.client_secret })
    }).catch((error) => { console.log('error', error) })

    // const intent = await stripe.paymentIntents.create({
    //     amount: orderObject.amount * 100,
    //     currency: 'eur',
    //     payment_method_types: ["card"],
    //     // confirm: true,
    //     // // payment_method: '{{PAYMENT_METHOD_ID}}',
    //     // payment_method_options: {
    //     //     card: {
    //     //         network: 'cartes_bancaires',
    //     //     },
    //     // },
    //     // metadata: { 'Client': fullName },
    //     // receipt_email: orderObject.customer.email
    // });
    // console.log("intent", intent);
    // res.json({ client_secret: intent.client_secret });

}