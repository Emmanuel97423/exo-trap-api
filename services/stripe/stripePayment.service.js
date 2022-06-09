const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { Lineitems } = require("./lineItems")




const createCheckoutStripePayment = async (req, res, next) => {
    console.log('req:', req.body)

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
            // If you already have the shipping address, provide it in payment_intent_data:
            payment_intent_data: {
                shipping: {
                    name: 'Jenny Rosen',
                    address: {
                        line1: '1234 Main Street',
                        city: 'San Francisco',
                        state: 'CA',
                        country: 'US',
                        postal_code: '94111',
                    },
                },
            },
            success_url: process.env.CLIENT_URL + '/payment/sucess?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: process.env.CLIENT_URL + '/',
        });
        // console.log('session:', session)
        // res.redirect(303, session.url);
        res.status(200).json({ "session": session })
    } catch (error) {

        res.status(500).json({ "error": error })
    }
}

module.exports = { createCheckoutStripePayment }