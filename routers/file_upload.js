'use strict';
const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/file_portfolio/')
  },
  filename: (req, file, cb) => {
    cb(null, flie.originalname)
  }
});

const upload = multer({
  storage: storage
});
const up = upload.fields([{name: 'docx', maxCount: 1}]);

router.post('/',up, (req, res, next) => {
  res.redirect('/');
});

module.exports = router;