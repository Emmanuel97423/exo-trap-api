const passwordValidatorSchema = require("../models/PasswordValidator.model.js");




const passwordWordValidator = (req, res, next) => {
    console.log('body', req.body.password);
    console.log(
        passwordValidatorSchema.validate(req.body.password, { liste: true })
    );
    if (!passwordValidatorSchema.validate(req.body.password)) {
        return res.status(400).json({
            passwordError:
                "Entre 5 et 25 caractères, au moins deux chiffres et une majuscule",
        });
    } else {
        next();
    };
};


module.exports = passwordWordValidator

