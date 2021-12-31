// const nodemailer = require('nodemailer');
// // const url = 'http://localhost:8080/api/user/confirmEmail/'

// const sendEmailOrder = async (order, userId) => {
//     console.log('userId:', userId)
//     console.log('order:', order)
//     let testAccount = await nodemailer.createTestAccount();

//     // create reusable transporter object using the default SMTP transport
//     let transporter = nodemailer.createTransport({
//         host: "smtp.ethereal.email",
//         port: 587,
//         secure: false, // true for 465, false for other ports
//         auth: {
//             user: testAccount.user, // generated ethereal user
//             pass: testAccount.pass, // generated ethereal password
//         },
//     });

//     // send mail with defined transport object
//     let info = await transporter.sendMail({
//         from: '"Fred Foo 👻" <pool@exo-trap.re>', // sender address
//         to: "bar@example.com, baz@example.com", // list of receivers
//         subject: "Commande validée ✔", // Subject line
//         text: "Hello world?", // plain text body
//         html:       `<h2>Votre commande à bien été pris en compte par nos service</h2>
//                     <p>Consultable via  <a href="https://exo-trap.re/my-account/orders">en cliquant ici</a></p>
//         `,
//     });

//     console.log("Message sent: %s", info.messageId);
//     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//     // Preview only available when sending through an Ethereal account
//     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
// }
// sendEmailOrder().catch(console.error)

// module.exports = sendEmailOrder