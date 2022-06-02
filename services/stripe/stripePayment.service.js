const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { Lineitems } = require("./lineItems")




const createCheckoutStripePayment = async (req, res, next) => {
    console.log('req:', req.body)

    try {
        const products = req.body;
        const productsArrayStripeModel = [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'T-shirt',
                    },
                    unit_amount: 2000,
                },
                quantity: 1,
            },
        ];
        const productsArray = []

        products.forEach(product => {
            const items = new Lineitems(product);
            productsArray.push(items.productItems())

        });
        const session = await stripe.checkout.sessions.create({

            line_items: productsArray,
            mode: 'payment',
            success_url: process.env.CLIENT_URL + '/payment/sucess',
            cancel_url: process.env.CLIENT_URL + '/payment/error',
        });
        // console.log('session:', session)
        res.redirect(303, session.url);
        // res.status(200).json({ "session": session })
    } catch (error) {
        res.status(500).json({ "error": error })
    }
}

module.exports = { createCheckoutStripePayment }