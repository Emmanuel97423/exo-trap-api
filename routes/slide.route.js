const express = require('express');
const router = express.Router();
const Slide = require('../models/Slide.model');
const multer = require('multer');
const DIR = './images/';

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, DIR)
    },
    filename: (req, file, cb) => {
    console.log('file:', file)
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {     
         const name = file.fieldname.split(" ").join("_") + "."+ MIME_TYPES[file.mimetype];
      cb(null, name);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});
const upload = multer({
    storage: storage,
    
});
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

router.post('/', upload.single('slide01'), async (req, res) => {
const url = req.protocol + '://' + req.get('host')
         const extension = req.file.mimetype;
const fileUrl = url +"/images/" + req.file.fieldname  + "." + MIME_TYPES[extension]
console.log('fileUrl:', fileUrl)

// console.log('req:', req.file)

const slide = new Slide({
    title: req.body.title,
    description: req.body.description,
    imageUrl: fileUrl,
});
// let err = slide.joiValidate(req.body);
//   if (err) throw err;
slide.save((err, result)=>{
    if(err) return res.status(400).json({ "message": "Une Erreur s'est produite", "error": err });
    if(result) return res.status(200).json({ "message": result})
})

});

module.exports = router;