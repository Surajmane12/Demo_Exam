const express = require('express');
const {  upload,uploadFile } = require('../controller/HallTicketUploads/HallTicketUploadController');

const router = express.Router();

router.post('/upload',upload.single('file'), uploadFile);

module.exports = router;

// const express = require("express");
// const {} = require('../controller/HallTicketUploads/HallTicketUploadController')
// const router = express.Router();

// import multer, { diskStorage } from 'multer';


// const storage = diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'Uploads/'); // Directory to save the uploaded files
//     },
//     filename: (req, file, cb) => {
//       // Use the original name with a timestamp to avoid name conflicts
//       const ext = path.extname(file.originalname);
//       const basename = path.basename(file.originalname, ext);
//       cb(null, `${basename}-${Date.now()}${ext}`);
//     }
//   });


  
// const upload = multer({ storage: storage });

// // router.get('/view_notices', view_notice);
// router.post('student/upload',upload.single('pdf'),upload);
// // router.post('/delete_notice/:id',delete_notice);
// // router.post('/edit_notice/:id',upload_notice);


// export default router;
