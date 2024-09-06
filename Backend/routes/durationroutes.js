const express = require("express");
const path = require('path'); // Make sure to require 'path' module
const { view_notice, upload_notice, delete_notice, edit_notice } = require("../controller/Notice/NoticeController");
const router = express.Router();
const multer = require('multer');
const {get_duration} = require("../controller/ExamController/DurationController");

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save the uploaded files
  },
  filename: (req, file, cb) => {
    // Use the original name with a timestamp to avoid name conflicts
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${basename}-${Date.now()}${ext}`);
  }
});

const upload = multer({ storage: storage });

router.get('/get_duration', get_duration);



module.exports = router;
