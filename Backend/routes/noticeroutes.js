const express = require("express");
const {view_notice, upload_notice,delete_notice,upload} = require("../controller/Notice/NoticeController");
const router = express.Router();
const path = require('path');



router.get('/view_notices', view_notice);
// router.get('/document', view_document);
router.post('/upload_notice',upload.single('file'),upload_notice);
// router.post('/upload',upload.single('file'), uploadFile);

router.post('/delete_notice/:id',delete_notice);
router.post('/edit_notice/:id',upload_notice);

router.get('/document/:filename', (req, res) => {
  const { filename } = req.params;
  console.log( __dirname);
 
  const filePath = path.join(__dirname, '..', 'controller/Notice/Uploads', filename);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(404).send('File not found');
    }
  });
});


module.exports = router;
