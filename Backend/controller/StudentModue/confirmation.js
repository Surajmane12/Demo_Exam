const express = require("express");
const cors = require("cors");
const asyncHandler = require("express-async-handler");
const db = require("../../config/dbConfig");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql");

// const app = express();

// app.use(cors());
// app.use(express.json());

// database connection
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'newuser2',
//     password: 'root',
//     database: 'academate',
// });

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadDir = "controller/StudentModue/Uploads";
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// Endpoint to handle file upload 
// app.post("/upload", upload.single("file"), (req, res) => {
//     const studentId = 145;
//     if (!req.file) {
//         return res.status(400).json({ Message: "No file uploaded" });
//     }

//     const sql = "INSERT INTO uploads (filename,student_id) VALUES (?,?)";
//     db.query(sql, [req.file.filename,studentId], (err, result) => {
//         if (err) {
//             console.log("Error in uploading file", err);
//             return res.status(500).json({ Message: "Error in saving file" });
//         }
//         res.send({ Message: "File uploaded successfully", file: req.file });
//     });
// });

const student_exam_confi_upload= asyncHandler(async (req, res)=> {
    
    if (!req.file) {
        return res.status(400).json({ Message: "No file uploaded" });
    }

    const studentId = "VU1F1920106"; // Ensure studentId is sent in the request body

    const insertSql = "INSERT INTO upload_exam_confirmation (file_name, stud_clg_id) VALUES (?, ?)";
    
    db.query(insertSql, [req.file.filename, studentId], (err, result) => {
        if (err) {
            console.log("Error in uploading file", err);
            return res.status(500).json({ Message: "Error in saving file" });
        }
        
        const updateSql = "UPDATE upload_exam_confirmation SET status = 1 WHERE stud_clg_id = ?";
        
        db.query(updateSql, [studentId], (updateErr, updateResult) => {
            if (updateErr) {
                console.log("Error in updating status", updateErr);
                return res.status(500).json({ Message: "Error in updating status" });
            }
            
            res.send({ Message: "File uploaded and status updated successfully", file: req.file });
        });
    });
});


// app.listen(8081, () => {
//     console.log("Backend server is running on http://localhost:8081");
// });

// app.get('/', (req, res) => {
//     const sql = "SELECT * FROM notice";
//     db.query(sql, (err, result) => {
//         if (err) return res.json({ Message: "Error in fetching data" });
//         return res.json(result);
//     });
// });

module.exports = { student_exam_confi_upload ,storage,upload};