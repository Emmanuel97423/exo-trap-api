const Adress = require("../models/Adress.model")


exports.create = (req, res, next) => {

    const adressObject = req.body;
    console.log('adressObject:', adressObject);
    const adress = new Adress({
        ...adressObject
    });
    adress.save().then(() => { res.status(200).json({ message: "adresse enregistré avec succé" }) }).catch(err => res.status(500).json({ error: err }))


}

exports.getAdresses = (req, res, next) => {
    const id = req.params.id

    Adress.find({ userId: id })
        .then((adresses) => res.status(200).json(adresses))
        .catch((error) => res.status(400).json({ error }));
}

