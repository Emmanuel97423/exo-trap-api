const mongoose = require('mongoose');

const productGammeSchema = mongoose.Schema({
    // id: { type: mongoose.Schema.ObjectId, ref: "productgammes" },
    codeArticleGamme: { type: String, required: true },
    libelle: { type: String, required: true },
    libelleFamille: { type: String, required: true },
    brand: { type: String, required: false },
    pvHt: { type: Number, required: true },
    tva: { type: String, required: true },
    imageUrl: { type: Array, required: false },
    pvTtc: { type: Number, required: true },
    description: { type: String, required: false },
})

module.exports = mongoose.model("ProductGamme", productGammeSchema)