const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3-transform");
const sharp = require("sharp");

require("dotenv").config();

aws.config.update({
  apiVersion: "2006-03-01",
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey,
  region: process.env.AWSRegion,
});
const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSBucket,
    shouldTransform: function (req, file, cb) {
      cb(null, /^image/i.test(file.mimetype));
    },
    transforms: [
      {
        id: "original",
        key: function (req, file, cb) {
          cb(
            null,
            Date.now().toString() + "image-original.jpg" + file.originalname
          );
        },
        transform: function (req, file, cb) {
          cb(null, sharp().resize(510, 600));
        },
      },
      {
        id: "thumbnail",
        key: function (req, file, cb) {
          cb(
            null,
            Date.now().toString() + "image-thumbnail" + file.originalname
          );
        },
        transform: function (req, file, cb) {
          cb(null, sharp().resize(110, 200));
        },
      },
    ],
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + file.originalname);
    },
  }),
});

module.exports = upload;
