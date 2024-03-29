const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user.controller");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");
const passwordValidator = require("../middleware/passwordValidator");
const multer = require('multer');
const multerUpload = multer();

// upload.single("idFile"),


router.post("/login", userCtrl.login);
router.post("/signup", passwordValidator, userCtrl.signup);
router.post("/logout", userCtrl.logout);
router.get("/getAllUsers", userCtrl.getAllUsers);
router.get("/user/:id", userCtrl.getOne);
router.put("/update/:id", userCtrl.update);
router.put("/addInvoicingAdresse/:id", userCtrl.addInvoicingAdresse);
router.get("/me", auth, userCtrl.me);
router.post("/requestResetPassword", userCtrl.requestResetPassword);
router.post("/resetPassword/:token/:id", passwordValidator, userCtrl.resetPassword);
router.post("/updateValidation/:id", userCtrl.updateValidation)

//Confirm email confirmation
router.get("/confirmEmail/:token/:id", userCtrl.confirmEmail);

module.exports = router;
