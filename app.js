const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/user.route");
const productRoute = require("./routes/product.route");
const orderRoute = require("./routes/order.route");
const path = require("path");

const app = express();

require("dotenv").config();

//Connexion à mongodb
mongoose
  .connect(process.env.MONGO_CONNECTION_SUPER_ADMIN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.log("Connexion à MongoDB échouée !: " + error));

//Requête CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routage
app.use("/api/auth", userRoute);
app.use("/api/product", productRoute);
//Route vers le stockage des images
app.use("/images", express.static(path.join(__dirname, "images")));
//Routage commandes
app.use("/api/order", orderRoute)

module.exports = app;
