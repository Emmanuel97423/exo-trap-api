const Adress = require("../models/Adress.model")


exports.create = (req, res, next) => {

    const adressObject = req.body;
    console.log('adressObject:', adressObject)
    Adress.findOne({ userId: req.body.userId }).then((adress) => {
        if (adress) {
            Adress.updateOne({ userId: req.body.userId }, {
                ...adressObject,

            }).then(() => res.status(200).json({ message: "Objet modifié !" }))
                .catch((error) => res.status(400).json({ error }));
        } else {
            const adress = new Adress({
                ...adressObject
            });
            adress.save().then(() => { res.status(200).json({ message: "adresse enregistré avec succé" }) }).catch(err => res.status(500).json({ error: err }))
        }
    })


}

exports.getAdress = (req, res, next) => {
    const id = req.params.id
    console.log('id:', id)
    Adress.findOne({ userId: id })
        .then((adresses) => res.status(200).json(adresses))
        .catch((error) => res.status(400).json({ error }));
}

