const JWT = require("jsonwebtoken");
const User = require("../models/User.model");
const Token = require("../models/Token.model");
// const sendEmail = require("../utils/email/sendEmail");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const JWTSecret = process.env.JWT_SECRET;
const bcryptSalt = process.env.BCRYPT_SALT;
const clientURL = process.env.CLIENT_URL;
// const requestPasswordReset = async (email) => {

//     const user = await User.findOne({ email });

//     if (!user) throw new Error("User does not exist");
//     let token = await Token.findOne({ userId: user._id });
//     if (token) await token.deleteOne();
//     let resetToken = crypto.randomBytes(32).toString("hex");
//     const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));

//     await new Token({
//         userId: user._id,
//         token: hash,
//         createdAt: Date.now(),
//     }).save();

//     const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;
//     sendEmail(user.email, "Password Reset Request", { name: user.name, link: link, }, "./template/requestResetPassword.handlebars");
//     return link;
// };
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
                    res.status(200).json({ "message": "Token saved successfully" })
                }).catch(error => { res.status(error).json({ "message": error }) })
            }).catch((error) => res.status(500).json({ error }));
        }).catch((error) => { res.status(500).json({ "error": error }) });
        let token = Token.findOne({ userId: user._id });
    }).catch((error) => res.status(500).json({ error }))
}
module.exports = { requestResetPassword }