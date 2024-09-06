const bcrypt = require('bcrypt');
const connection = require('../../config/dbConfig'); // Adjust the path accordingly
const asyncHandler = require('express-async-handler'); // If not installed, run `npm install express-async-handler`
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../../config/dbConfig');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      const uploadDir = path.resolve('controller/Notice/Uploads');
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





const form1 =asyncHandler(async (req, res) => {
    const { email } = req.params;
    console.log(req.body);
    const {
      firstname,
      middleName,
      lastName,
      tpoId,
      clgId,
      mobile,
      gender,
      dob,
      branch,
      ay,
      loc,
    } = req.body;
    const q =
      "SELECT * FROM student_details where tpo_id = (?) OR clg_id =(?) OR mobile=(?)";
    connection.query(q, [tpoId, clgId, mobile], (err, data) => {
      if (err) return res.json(err);
      if (data.length)
        return res.status(409).json("tpoId or clgid or mobile all ready exist!");
      const q = `
      UPDATE student_details 
      SET 
        first_name = ?, 
        middle_name = ?, 
        last_name = ?, 
        tpo_id = ?, 
        clg_id = ?, 
        mobile = ?, 
        gender = ?, 
        dob = ?, 
        branch = ?, 
        degree = ?, 
        loc = ? 
      WHERE 
        email_id = ?
    `;
      const values = [
        firstname,
        middleName,
        lastName,
        tpoId,
        clgId,
        mobile,
        gender,
        dob,
        branch,
        ay,
        loc,
        email,
      ];
  
      connection.query(q, values, (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json("User form1 has been updated;");
      });
    });
  });

  const view_notice = asyncHandler(async (req, res) => {

    const q = `SELECT * from exam_notices;`;

    connection.query(q, (err, data) => {
      if (err) return res.json(err);
      console.log("Result:",data);
      return res.status(200).json(data);
    });


  })


  const upload_notice = asyncHandler(async (req, res) => {
    console.log("sdhvfskjd")
    const { name ,description} = req.body;
    console.log("To upload notice:", req.body);
  
  
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    if (!req.file.originalname.match(/\.(pdf)$/)) {
      res.send({ msg:'Only image files (pdf) are allowed!'})};
  
    const filename = req.file.filename;
    console.log(filename)
    const postDate = new Date(); 
  
    const sql = `INSERT INTO exam_notices (name, file,post_date,descrip) VALUES (?, ?,?,?)`;
  
    connection.query(sql, [name, filename, postDate,description], (err, result) => {
      if (err) {
        console.log(err)
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ message: 'PDF file uploaded and saved in database' });
    });
  });
  


 const delete_notice=asyncHandler(async (req, res) => {
  console.log(req.params)
    const id  = req.params.id;
    console.log("To Delete Notice:",id);

  
    const sql = 'DELETE FROM exam_notices WHERE notice_id=?';
  
    connection.query(sql,id, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ message: 'Deleted Successfully!!' });
    });
  });


  const edit_notice = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const desc = req.body.description;
    let file = req.file ? req.file.filename : null; // Handle file from multer
  
    console.log("To Edit Notice:", id, name, file, desc);
  
    let sql;
    let params;
    if (file) {
      sql = 'UPDATE exam_notices SET name=?, descrip=?, file=? WHERE notice_id=?';
      params = [name, desc, file, id];
    } else {
      sql = 'UPDATE exam_notices SET name=?, descrip=? WHERE notice_id=?';
      params = [name, desc, id];
    }
  
    connection.query(sql, params, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ message: 'Edited Successfully!!' });
    });
  });

 
  
module.exports = {view_notice,form1,upload_notice,delete_notice,edit_notice,storage,upload};