const express = require('express');
const router = express.Router();
const Slide = require('../models/Slide.model');
const multer = require('multer');
const DIR = './images/';
// Require the Cloudinary library
const cloudinary = require('cloudinary').v2;
//Cloudinary access config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
// cloudinary.api.delete_upload_preset("my_preset").then(result=>console.log('delete preset', result));
cloudinary.api.create_upload_preset(
  { name: "my_preset", 
    unsigned: true, 
    public_id: "slide-landing-page01" ,
    // categorization: "google_tagging,google_video_tagging",
    // auto_tagging: 0.75,
    // background_removal: "cloudinary_ai",  
    folder: "slides" })
  .then(result=>console.log(result));

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, DIR)
    },
    filename: (req, file, cb) => {
    // console.log('file:', file)
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
        const titleSlide = req.body.title;
        const descriptionSlide = req.body.description;
        const url = req.protocol + '://' + req.get('host')
        const extension = req.file.mimetype;
        const fileUrl = url +"/images/" + req.file.fieldname  + "." + MIME_TYPES[extension];

        cloudinary.uploader.upload("./images/" + req.file.fieldname + "." + MIME_TYPES[extension] , {upload_preset: "my_preset"}, (error, result)=>{
        if(error) console.log(error);
        if(result) {

        Slide.findOneAndUpdate({ codeSlide : "01" } , { 
          title:titleSlide,
          description:descriptionSlide,
          imageUrl : result.secure_url
        }, { new :true }, (error, slideUpdateResult)=>{
        if(error)  {
          console.log('error:', error)
          res.status(500).json({ "message": "Une Erreur s'est produite", "error": err })
        };
        if(slideUpdateResult) res.status(200).json({"message": "Mise à jour terminé"});
        if(!slideUpdateResult) {
          const slide = new Slide({
            codeSlide:"01",
            title: titleSlide,
            description: descriptionSlide,
            imageUrl: result.secure_url,
        });
        slide.save((err, result)=>{
            if(err) return res.status(400).json({ "message": "Une Erreur s'est produite", "error": err });
            if(result) return res.status(200).json({ "message": result})
        })
        }
        })

        }
        });



});

router.get('/', async (req, res, next)=>{
  Slide.find({}, (error, slide)=>{
    if(error) return res.status(500).json({ "message": "Une Erreur s'est produite", "error": err });
    if(slide) return res.status(200).json({slide})
  })
})

module.exports = router;