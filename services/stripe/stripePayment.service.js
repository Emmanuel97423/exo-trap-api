const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { Lineitems } = require("./lineItems")
const Order = require("../../models/Order.model");
const Product = require("../../models/Product.model");
const User = require("../../models/User.model")
const dayjs = require('dayjs');
const { sendGridOrderConfirmation } = require("../../utils/email/sendgridEmail")
require('dayjs/locale/fr');




const createCheckoutStripePayment = async (req, res, next) => {
    const userId = req.body.userId
    const products = req.body.products;
    const shippingAdress = req.body.shippingAdress;
    const productsArray = [];

    //stripe Session method is
    const stripeSessionMethod = async (userItem, arrayItems, shippingItem) => {
        function addMinutes(date, minutes) {
            return new Date(date.getTime() + minutes * 60000);
        }
        const expiresAt = addMinutes(new Date(), 10)
        // console.log("🚀 ~ file: stripePayment.service.js ~ line 25 ~ stripeSessionMethod ~ sessionExpireAt", sessionExpireAt);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'afterpay_clearpay', 'klarna'],
            line_items: arrayItems,
            mode: 'payment',
            customer: userItem.stripeId,
            expires_at: expiresAt,
            payment_intent_data: {
                shipping: {
                    name: 'Exo-Trap',
                    address: {
                        line1: shippingItem.adress,
                        city: shippingItem.city,
                        state: shippingItem.region,
                        country: 'FR',
                        postal_code: shippingItem.zip,
                    },
                },
            },

            success_url: process.env.CLIENT_URL + '/payment/sucess?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: process.env.CLIENT_URL + '/my-account/checkout-1',

        });
        if (session) {
            console.log("🚀 ~ file: stripePayment.service.js ~ line 62 ~ User.findOneAndUpdate ~ session", session)

            return res.status(200).json({ "session": session })

        }
    }


    try {
        products.forEach(product => {
            const items = new Lineitems(product);
            productsArray.push(items.productItems())

        });
        //Sign in user with Stripe
        User.findOne({ _id: userId }, async (error, user) => {
            if (error) res.status(500).json({ error: error });
            if (user) {
                try {
                    if (!user.stripeId) {
                        const customer = await stripe.customers.create({
                            email: user.email,
                            name: user.firstName,
                        });
                        if (customer) {
                            User.findOneAndUpdate({ _id: userId }, {
                                $set: { stripeId: customer.id }
                            }
                                , { new: true }, async (error, userCreateCustomer) => {
                                    if (error) {
                                        console.log('error:', error)
                                        return res.status(500).json({ error: error })
                                    };
                                    if (userCreateCustomer) {
                                        console.log(userCreateCustomer);
                                        try {
                                            if (userCreateCustomer.stripeId) {
                                                // console.log('user:', user);
                                                stripeSessionMethod(userCreateCustomer, productsArray, shippingAdress);
                                                // const session = await stripe.checkout.sessions.create({
                                                //     payment_method_types: ['card', 'afterpay_clearpay', 'klarna'],
                                                //     line_items: productsArray,
                                                //     mode: 'payment',
                                                //     customer: user.stripeId,
                                                //     payment_intent_data: {
                                                //         shipping: {
                                                //             name: 'Exo-Trap',
                                                //             address: {
                                                //                 line1: shippingAdress.adress,
                                                //                 city: shippingAdress.city,
                                                //                 state: shippingAdress.region,
                                                //                 country: 'FR',
                                                //                 postal_code: shippingAdress.zip,
                                                //             },
                                                //         },
                                                //     },

                                                //     success_url: process.env.CLIENT_URL + '/payment/sucess?session_id={CHECKOUT_SESSION_ID}',
                                                //     cancel_url: process.env.CLIENT_URL + '/my-account/checkout-1',

                                                // });
                                                // if (session) {
                                                //     console.log("🚀 ~ file: stripePayment.service.js ~ line 62 ~ User.findOneAndUpdate ~ session", session)

                                                //     return res.status(200).json({ "session": session })

                                                // }

                                            }

                                        } catch (error) {
                                            console.log('error:', error)

                                        }
                                    };

                                })
                        }

                    } else {


                        const customerRetrieve = await stripe.customers.retrieve(
                            user.stripeId
                        );
                        // console.log("🚀 ~ file: stripePayment.service.js ~ line 85 ~ User.findOne ~ customerRetrieve", customerRetrieve)
                        try {
                            if (customerRetrieve.deleted == true) {
                                const customerCreate = await stripe.customers.create({
                                    email: user.email,
                                    name: user.firstName,
                                });
                                try {
                                    if (customerCreate) {
                                        console.log('customerCreate:', customerCreate)
                                        User.updateOne({ _id: userId }, { stripeId: customerCreate.id }, async (error, userUpdateStripeId) => {
                                            if (error) res.status(500).json({ error: error })
                                            if (userUpdateStripeId) {
                                                stripeSessionMethod(customerCreate, productsArray, shippingAdress);

                                                // const session = await stripe.checkout.sessions.create({
                                                //     payment_method_types: ['card', 'afterpay_clearpay', 'klarna'],
                                                //     line_items: productsArray,
                                                //     mode: 'payment',
                                                //     customer: customerCreate.id,
                                                //     payment_intent_data: {
                                                //         shipping: {
                                                //             name: 'Exo-Trap',
                                                //             address: {
                                                //                 line1: shippingAdress.adress,
                                                //                 city: shippingAdress.city,
                                                //                 state: shippingAdress.region,
                                                //                 country: 'FR',
                                                //                 postal_code: shippingAdress.zip,
                                                //             },
                                                //         },
                                                //     },

                                                //     success_url: process.env.CLIENT_URL + '/payment/sucess?session_id={CHECKOUT_SESSION_ID}',
                                                //     cancel_url: process.env.CLIENT_URL + '/my-account/checkout-1',

                                                // });
                                                // if (session) {
                                                //     return res.status(200).json({ "session": session })

                                                // }
                                                // console.log("🚀 ~ file: stripePayment.service.js ~ line 99 ~ User.findOne ~ session", session)
                                            }
                                        })

                                    }
                                } catch (error) {
                                    console.log('error:', error)

                                }
                            } else {
                                stripeSessionMethod(user, productsArray, shippingAdress);

                                // const session = await stripe.checkout.sessions.create({
                                //     payment_method_types: ['card', 'afterpay_clearpay', 'klarna'],
                                //     line_items: productsArray,
                                //     mode: 'payment',
                                //     customer: user.stripeId,
                                //     payment_intent_data: {
                                //         shipping: {
                                //             name: 'Exo-Trap',
                                //             address: {
                                //                 line1: shippingAdress.adress,
                                //                 city: shippingAdress.city,
                                //                 state: shippingAdress.region,
                                //                 country: 'FR',
                                //                 postal_code: shippingAdress.zip,
                                //             },
                                //         },
                                //     },

                                //     success_url: process.env.CLIENT_URL + '/payment/sucess?session_id={CHECKOUT_SESSION_ID}',
                                //     cancel_url: process.env.CLIENT_URL + '/my-account/checkout-1',

                                // });
                                // if (session) {
                                //     return res.status(200).json({ "session": session })

                                // }
                                // console.log("🚀 ~ file: stripePayment.service.js ~ line 99 ~ User.findOne ~ session", session)
                            }

                        } catch (error) {
                            console.log('error:', error)

                        }


                    }
                } catch (error) {
                    console.log('error:', error)
                    return res.status(500).json({ error: error })
                }
            }

        });

    } catch (error) {

        res.status(500).json({ "error": error })
    };


}

//method for account create for marketplace
// if (!user.stripeId) {
//     try {
//         const stripeToken = await stripe.tokens.create({

//             account: {
//                 business_type: "individual",
//                 individual: {
//                     first_name: user.firstName,
//                     email: user.email,
//                     metadata: { 'magasin': 'Exo-Trap' }
//                 },

//                 tos_shown_and_accepted: true,
//             },

//         })
//         if (stripeToken) {
//             try {
//                 const account = await stripe.accounts.create({
//                     type: "custom",
//                     capabilities: {
//                         card_payments: { requested: true },
//                         // cartes_bancaires_payments: { requested: true },
//                         afterpay_clearpay_payments: { requested: true },
//                         // klarna_payments: { requested: true },
//                         transfers: { requested: true },
//                     },
//                     account_token: stripeToken.id
//                 });
//                 console.log('account:', account)
//                 if (account) {

//                 }
//             } catch (error) {
//                 console.log('error:', error)

//             }


//         }

//     } catch (error) {
//         console.log('error:', error)

//     }

// }

module.exports = { createCheckoutStripePayment }