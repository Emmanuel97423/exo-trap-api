const passwordValidator = require("password-validator");

// Creation du schema
const schema = new passwordValidator();

// Add properties to it
schema
    .is()
    .min(8) // 8 caractères minimum
    .is()
    .max(30) // 30 caractères maximum
    .has()
    .uppercase() // Doit contenir 1 masjuscule
    .has()
    .lowercase() // Doit contenir 1 minuscule
    .has()
    .digits(2) // Doit contenir au moin 2 chiffres
    .has()
    .not()
    .spaces() // Ne doit pas contenir d'espace
    .is()
    .not()
    .oneOf(["Passw0rd", "Password123", "p123456789"]); // Valeur blacklister

console.log(schema.validate("joke", { list: true }));

module.exports = schema;