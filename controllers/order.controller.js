const Order = require("../models/Order.model")

exports.create = (req, res, next) => {
    const orderObject = req.body;
   
    const order = new Order({
        ...orderObject
    });
    order.save().then(() => {
        res.status(201).json({message : "Commande crée avec succée"})
    }).catch(err => { res.status(500).json({err})})
}