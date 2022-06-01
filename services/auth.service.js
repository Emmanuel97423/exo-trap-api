const JWT = require("jsonwebtoken");
const User = require("../models/User.model");
const Token = require("../models/Token.model");
// const sendEmail = require("../utils/email/sendEmail");
const { sendGridEmailResetPassword } = require("../utils/email/sendgridEmail");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const JWTSecret = process.env.JWT_SECRET;
const bcryptSalt = process.env.BCRYPT_SALT;
const clientURL = process.env.CLIENT_URL;

const requestResetPassword = (req, res) => {
    console.log('req:', req.body)

    User.findOne({ email: req.body.email }).then((user) => {

        if (!user) {
            res.status(400).json({ "message": "Utilisateur non trouvé" })
        }
        Token.findOne({ userId: user._id }).then((token) => {
            if (token) {
                token.deleteOne()
            };
            let resetToken = crypto.randomBytes(32).toString("hex");
            bcrypt.hash(resetToken, Number(bcryptSalt)).then((hash) => {
                const token = new Token({
                    email: user.email,
                    userId: user._id,
                    token: hash,
                    createdAt: Date.now(),
                });
                token.save().then(() => {
                    const link = `${clientURL}/resetting/reset?token=${resetToken}&id=${user._id}`;
                    sendGridEmailResetPassword(res, link, req.body.email);

                }).catch(error => { res.status(error).json({ "message": error }) })
            }).catch((error) => res.status(500).json({ error }));
        }).catch((error) => { res.status(500).json({ "error": error }) });
        // let token = Token.findOne({ userId: user._id });
    }).catch((error) => res.status(500).json({ error }))
}

const resetPassword = (req, res) => {
    console.log('req:', req.params)
    const userId = req.params.id;
    const tokenParams = req.params.token;
    const password = req.body.password
    Token.findOne({ userId: userId }).then((token) => {
        if (!token) {
            return res.status(400).json({ "message": "Lien est invalide ou à expérirer" })
        }
        bcrypt.compare(tokenParams, token.token).then((data) => {
            if (!data) {
                return res.status(400).json({ "message": "Lien est invalide ou à expérirer" })
            }
            if (!password) {
                return res.status(400).json({ "message": "Mot de passe manquant" })
            }
            bcrypt.hash(password, Number(bcryptSalt)).then((hash) => {
                User.updateOne({ _id: userId }, { $set: { password: hash } }).then(() => {
                    Token.deleteOne({ userId: userId }).then(() => {
                        return res.status(200).json({
                            "message": "Mot de passe modifier"
                        })
                    }).catch(error => {
                        console.log(error)
                        return res.status(500).json({ "message": "Une erreur s'est produite, veuillez recommencer ulterieurement" })
                    })

                }).catch((error) => {
                    console.log(error)
                    return res.status(500).json({ "message": "Une erreur s'est produite, veuillez recommencer ulterieurement" })
                })
            });


        }).catch((error) => res.status(500).json({ error }))
    }).catch((error) => {
        console.log(error)
        return res.status(500).json({ "error": error })
    })

}
module.exports = { requestResetPassword, resetPassword };