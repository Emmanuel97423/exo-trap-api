const passwordValidatorSchema = require("../models/PasswordValidator.model.js");

module.exports = (req, res, next) => {
    console.log('body', req.body);
    console.log(
        passwordValidatorSchema.validate(req.body.password, { liste: true })
    );
    if (!passwordValidatorSchema.validate(req.body.password)) {
        return res.status(400).json({
            passwordError:
                "Entre 8 et 30 caractères, au moins deux chiffres et une majuscule",
        });
    } else {
        next();
    }
};