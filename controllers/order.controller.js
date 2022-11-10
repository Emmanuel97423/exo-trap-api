// const { CodeCommit } = require("aws-sdk");
const Order = require("../models/Order.model");
const Product = require("../models/Product.model");
const User = require("../models/User.model")
const stripe = require("stripe")(process.env.STRIPE_PUBLIC_KEY);
const dayjs = require('dayjs');
// const sendEmailOrder = require('../utils/sendEmailOrder')
const { createCheckoutStripePayment } = require("../services/stripe/stripePayment.service");
const { sendGridOrderConfirmation, sendGridOrderChangeStatus } = require("../utils/email/sendgridEmail")
require('dayjs/locale/fr');

// const initialName = require('../utils/initialName')


//Create order
//No use. Use payment route for order feature
exports.create = async (req, res, next) => {
    // console.log('req:', req)
    // const sessionStripeRequestId = await stripe.checkout.sessions.retrieve(req.query.session_id);

    const orderObject = req.body;
    const sessionId = req.params.session_id
    // console.log('orderObject:', orderObject)
    // const initial = initialName(orderObject.customer.lastName, orderObject.customer.firstName)


    Order.findOne({ paymentSessionId: sessionId }, (error, order) => {
        if (error) res.status(500).json({ error: error });
        if (order) {
            res.status(401).json({ message: "la session de commande à expirer" })
        } else {
            const order = new Order({
                ...orderObject,
                date: dayjs().locale('fr').format('dddd, D MMMM, YYYY HH:mm'),
                orderNumberId: dayjs().locale('fr').format('MMDDYYHHmm'),
                status: "En attente...",
                paymentSessionId: sessionId
            });

            order.save().then((order) => {
                // console.log("🚀 ~ file: order.controller.js ~ line 48 ~ order.save ~ order", order)
                const orderId = order.orderNumberId
                const products = orderObject.products
                // sendEmailOrder(orderObject.products)
                // console.log('product:', products)
                for (const product of products) {
                    let decQuantity = product.orderQuantity
                    Product.updateOne({ _id: product._id }, { $inc: { stock: - decQuantity } })
                        .then((res) => {
                            console.log('Décrementation du stock OK:' + product.libelle);


                        }).catch(err => console.log('Error:', err))
                };
                User.findOne({ _id: orderObject.userId }).then((res) => {
                    sendGridOrderConfirmation(orderId, res.email)
                    return res.status(200).json({ "message": "Commande validée!" })

                }).catch((err) => { res.status(404).json(err) })



            }).catch((err) => { console.log(err) });
        }
    })






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
exports.allOrdersAdmin = (req, res, next) => {

    Order.find({}).then((orders) => {
        res.status(200).json({ orders: orders })
    }).catch((error) => { res.status(404).json({ message: 'Pas de commandes' }) })
}
exports.changeOrderStatus = (req, res, next) => {
    
    const filter = { orderNumberId: req.body.orderId };
    const update = { status: req.body.status };
    const orderId = req.body.orderId;
    const status = req.body.status;
    const orderUserId = req.body.userId;
   
    Order.updateOne(filter, update, (err, order) => {
       
        if (err) { 
            console.log('err:', err)
            return res.status(500).json(err)
        };
        if (order) {
            
            User.findOne({'_id': orderUserId}, (err, user) => {
                if (err) res.status(500).json(err);
                if (user){
                // console.log('user:', user)
            sendGridOrderChangeStatus(orderId, user.email, status)
            res.status(200).json(order)

                }
            })
        };

    })

}

exports.getOne = (req, res, next) => {
    Order.findOne({ _id: req.params.id }).then((order) => {
        res.status(200).json(order)
    }).catch((error) => { res.status(404).json({ message: 'Pas de commande' }) })
}

exports.stripeCheckout = async (req, res, next) => {

    const products = req.body.products;
    let numberOfProductInCart = products.length;
    products.map((product) => {
        const productId = product._id;
        Product.findOne({ _id: productId }, (err, result) => {
            if (err) res.status(400).json({ "message": "Une Erreur s'est produite", "error": err });
            if (result) {
                if (result.stock < product.orderQuantity) {
                    console.log("Stock indisponible:" + result.libelle)
                    return res.status(200).json({ "message": `😅 Navré... le stock est indisponible pour cette quantité. Il reste ${result.stock} ${result.libelle} ` })
                } else {
                    numberOfProductInCart--
                    // console.log('numberOfProductInCart:', numberOfProductInCart)
                    if (numberOfProductInCart == 0) {
                        createCheckoutStripePayment(req, res)

                    } else {
                        return
                    }

                }

            } else {
                return res.status(404).json({ "message": "Article indisponible..." })
            }
        })
    })

}




