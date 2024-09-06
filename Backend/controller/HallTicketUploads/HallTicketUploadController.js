const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../../config/dbConfig');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.resolve('controller/HallTicketUploads/Uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// Set upload directory
// const upload = path.resolve(__dirname, 'Uploads');

// Configure storage for multer
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         if (!fs.existsSync(upload)) {
//             fs.mkdirSync(upload, { recursive: true });
//         }
//         cb(null, upload);
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));
//     },
// });

const uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ Message: "No file uploaded" });
    }

    const studentId = req.body.studentId || "VU1F1920106"; // Default student ID for testing

    const sql = "INSERT INTO upload_hallticket ( file_name) VALUES ( ?)";

    try {
        await db.execute(sql, [req.file.filename]);
        res.send({ Message: "File uploaded successfully", file: req.file });
    } catch (err) {
        console.error("Error in uploading file", err);
        res.status(500).json({ Message: "Error in saving file" });
    }
};

module.exports = {upload, uploadFile,storage};




// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';
// import db from '../../config/dbConfig'

// // const storage = multer.diskStorage({
// //     destination: function(req, file, cb) {
// //         const uploadDir = "Uploads/";
// //         if (!fs.existsSync(uploadDir)) {
// //             fs.mkdirSync(uploadDir);
// //         }
// //         cb(null, uploadDir);
// //     },
// //     filename: function(req, file, cb) {
// //         cb(null, Date.now() + path.extname(file.originalname));
// //     },
// // });

// const upload = multer({ storage: storage });

// // Endpoint to handle file upload 
// // app.post("/upload", upload.single("file"), (req, res) => {
// //     const studentId = 145;
// //     if (!req.file) {
// //         return res.status(400).json({ Message: "No file uploaded" });
// //     }

// //     const sql = "INSERT INTO uploads (filename,student_id) VALUES (?,?)";
// //     db.query(sql, [req.file.filename,studentId], (err, result) => {
// //         if (err) {
// //             console.log("Error in uploading file", err);
// //             return res.status(500).json({ Message: "Error in saving file" });
// //         }
// //         res.send({ Message: "File uploaded successfully", file: req.file });
// //     });
// // });

// app.post("student/upload", upload.single("file"), (req, res) => {
    
//     if (!req.file) {
//         return res.status(400).json({ Message: "No file uploaded" });
//     }

//     const studentId = "VU1F1920106"; // Ensure studentId is sent in the request body

//     const insertSql = "INSERT INTO upload_file_confirmation (file_name, stud_clg_id) VALUES (?, ?)";
    
//     db.query(insertSql, [req.file.filename, studentId], (err, result) => {
//         if (err) {
//             console.log("Error in uploading file", err);
//             return res.status(500).json({ Message: "Error in saving file" });
//         }
        
//         const updateSql = "UPDATE upload_file_confirmation SET status = 1 WHERE stud_clg_id = ?";
        
//         db.query(updateSql, [studentId], (updateErr, updateResult) => {
//             if (updateErr) {
//                 console.log("Error in updating status", updateErr);
//                 return res.status(500).json({ Message: "Error in updating status" });
//             }
            
//             res.send({ Message: "File uploaded and status updated successfully", file: req.file });
//         });
//     });
// });