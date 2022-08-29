const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { Lineitems } = require("./lineItems")
const Order = require("../../models/Order.model");
const Product = require("../../models/Product.model");
const User = require("../../models/User.model")
const dayjs = require('dayjs');
const { sendGridOrderConfirmation } = require("../../utils/email/sendgridEmail")
require('dayjs/locale/fr');




const createCheckoutStripePayment = async (req, res, next) => {
    // console.log('req stripe:', req.body)

    try {
        const products = req.body;
        // const productsArrayStripeModel = [
        //     {
        //         price_data: {
        //             currency: 'usd',
        //             product_data: {
        //                 name: 'T-shirt',
        //             },
        //             unit_amount: 2000,
        //         },
        //         quantity: 1,
        //     },
        // ];
        const productsArray = []

        products.forEach(product => {
            const items = new Lineitems(product);
            productsArray.push(items.productItems())

        });
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'afterpay_clearpay'],
            line_items: productsArray,
            mode: 'payment',
            shipping_address_collection: {
                // Specify which shipping countries Checkout should provide as options for shipping locations
                allowed_countries: ['FR'],
            },
            // success_url: process.env.CLIENT_URL + '/payment/sucess?session_id={CHECKOUT_SESSION_ID}',
            // cancel_url: process.env.CLIENT_URL + '/',

            success_url: 'http://localhost:3000/payment/sucess/?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:3000/',
        });
        // console.log('session:', session)
        // res.redirect(303, session.url);
        // console.log('session.status:', session.status)
        // if (session.status == 'complete') {
        //     const orderObject = req.body;
        //     // console.log('orderObject:', orderObject)
        //     // const initial = initialName(orderObject.customer.lastName, orderObject.customer.firstName)

        //     const order = new Order({
        //         ...orderObject,
        //         date: dayjs().locale('fr').format('dddd, D MMMM, YYYY HH:mm'),
        //         orderNumberId: dayjs().locale('fr').format('MMDDYYHHmm'),
        //         status: "En attente..."
        //     });
        //     order.save().then((order) => {
        //         console.log("🚀 ~ file: order.controller.js ~ line 48 ~ order.save ~ order", order)
        //         const orderId = order.orderNumberId
        //         const products = orderObject.products
        //         // sendEmailOrder(orderObject.products)
        //         // console.log('product:', products)
        //         for (const product of products) {
        //             let decQuantity = product.orderQuantity
        //             Product.updateOne({ _id: product._id }, { $inc: { quantity: - decQuantity } })
        //                 .then((res) => {
        //                     console.log('Décrementation du stock OK:' + product.libelle);
        //                     User.findOne({ _id: orderObject.userId }).then((res) => {
        //                         console.log("🚀 ~ file: order.controller.js ~ line 39 ~ User.findOne ~ res", res)
        //                         sendGridOrderConfirmation(orderId, res.email)
        //                     }).catch((err) => { res.status(404).json(err) })

        //                 }).catch(err => console.log('Error:', err))
        //         };



        //     }).catch((err) => { console.log(err) });
        // }
        res.status(200).json({ "session": session })
    } catch (error) {

        res.status(500).json({ "error": error })
    }
}

module.exports = { createCheckoutStripePayment }