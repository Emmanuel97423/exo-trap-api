const express = require("express");
require("express-async-errors");
const mongoose = require("mongoose");
const userRoute = require("./routes/user.route");
const productRoute = require("./routes/product.route");
const orderRoute = require("./routes/order.route");
const adressRoute = require("./routes/adress.route");
const categoryRoute = require("./routes/category.route");
const ProductGammesRoute = require('./routes/gammes.route');
const searchRoute = require("./routes/search.route");
const paymentRoute = require("./routes/payment.route");
const slideRoute = require("./routes/slide.route");
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
  mongoose.set('useFindAndModify', false);



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
app.use("/api/gammes", ProductGammesRoute)
//Route vers le stockage des images
// app.use("/images", express.static(path.join(__dirname, "images")));
//Routage commandes
app.use("/api/order", orderRoute);
//routage paiement
//user
app.use("/api/user", userRoute);

//Adress route;
app.use("/api/adress", adressRoute);

app.use('/api/payment', paymentRoute)

app.use('/api/category', categoryRoute)

app.use('/api/search', searchRoute)

app.use('/api/slides', slideRoute)
module.exports = app;
