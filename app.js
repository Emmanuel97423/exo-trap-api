const express = require("express");
require("express-async-errors");
const mongoose = require("mongoose");
const userRoute = require("./routes/user.route");
const productRoute = require("./routes/product.route");
const orderRoute = require("./routes/order.route");
const adressRoute = require("./routes/adress.route");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cors = require('cors')


// const path = require("path");

const app = express();

// app.use(cors())

require("dotenv").config();

//Connexion à mongodb
mongoose
  .connect(process.env.MONGO_CONNECTION_SUPER_ADMIN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.log("Connexion à MongoDB échouée !: " + error));



// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());


// Requête CORS
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content, Accept, Authorization, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, PATCH, OPTIONS"
//   );
//   next();
// });
app.use(cors({ origin: '*' }))
//Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

// let whitelist = ['http://localhost:4000', 'https://exo-trap.re']
// let corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

//Routage Authentification
app.use("/api/auth", userRoute);
app.use("/api/product", productRoute);
//Route vers le stockage des images
// app.use("/images", express.static(path.join(__dirname, "images")));
//Routage commandes
app.use("/api/order", orderRoute);
//routage paiement
//user
app.use("/api/user", userRoute);

//Adress route;
app.use("/api/adress", adressRoute);

app.use('/api/paymentSucess', async (req, res, next) => {
  try {
    console.log('req:', req.query)
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    const customer = await stripe.customers.retrieve(session.customer);
    res.status(200).json({ customer: customer })
  } catch (error) {
    console.log('error:', error)
    res.status(500).json({ Error: error })
  }
})



module.exports = app;
