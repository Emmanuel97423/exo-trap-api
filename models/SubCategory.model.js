const mongoose = require('mongoose');


const subCategorySchema = mongoose.Schema({
    codeSousFamille: { type: String, required: true },
    libelleSousFamille: { type: String, required: true },
    codeFamille: { type: String, required: true },
});

module.exports = mongoose.model("SubCategory", subCategorySchema)