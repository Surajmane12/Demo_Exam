const express = require("express");
const {student_exam_confi_upload,upload} = require(`../controller/StudentModue/confirmation`);
const router = express.Router();

// router = express.Router();

router.post('/upload', upload.single("file"),student_exam_confi_upload);

module.exports = router;