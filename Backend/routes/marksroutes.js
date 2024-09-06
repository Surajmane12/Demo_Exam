const express = require("express");
const path = require('path'); // Make sure to require 'path' module
const {upload,upload_marks,show_result,insertDataIntoTable,get_uploaded_result}=require('../controller/ExamController/ExamController')
const router = express.Router();
const multer = require('multer');




router.get('/uploaded_result/:filename', (req, res) => {
  const { filename } = req.params;
  console.log( __dirname);
 
  const filePath = path.join(__dirname, '..', 'controller/ExamController/Uploads', filename);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(404).send('File not found');
    }
  });
});

router.post('/import',upload.single('file'), insertDataIntoTable);

router.get('/show_result/:sub_code/:acad_year', show_result);
router.get('/get_uploaded_results/:user_id',get_uploaded_result)
module.exports = router;