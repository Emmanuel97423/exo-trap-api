// const sgMail = require('@sendgrid/mail')
// require("dotenv").config();
// sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// const url = 'https://trap-one-api.herokuapp.com/api/user/confirmEmail/';
// // const url = 'http://localhost:8080/api/user/confirmEmail/'

// const sendGridEmail = (confirmation) => {
//     console.log('confirmation:', confirmation)
//     const msg = {
//         to: `${confirmation.email}`, // Change to your recipient
//         from: 'pull@exo-trap.re', // Change to your verified sender
//         subject: 'Exo-trap: Confirmer votre compte',
//         text: 'and easy to do anywhere, even with Node.js',
//         html: `<a href=${url}${confirmation.token}/${confirmation.userId}><button>Confimer mon compte</button></a><br>ID de confirmation`,
//     }

//     sgMail
//         .send(msg)
//         .then((response) => {
//             console.log(response[0].statusCode)
//             console.log(response[0].headers)
//             return response
//         })
//         .catch((error) => {
//             console.error(error)
//         })
// }

// module.exports = sendGridEmail