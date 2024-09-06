const bcrypt = require('bcrypt');
const connection = require('../../config/dbConfig'); // Adjust the path accordingly
const asyncHandler = require('express-async-handler'); // If not installed, run `npm install express-async-handler`


const login = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const pass = req.body.pass;
  console.log("Reg Data:", req.body);

  const selectQuery = "SELECT * FROM students WHERE email_id = ?";
  connection.query(selectQuery, [email], (err, data) => {
    if (err) return res.json(err);
    if (data.length) return res.status(409).json("User already exists!");

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pass, salt);

    const insertQuery = "INSERT INTO student_details (email_id, pass) VALUES (?, ?)";
    connection.query(insertQuery, [email, hash], (err, data) => {
      if (err) return res.json(err);
      return res.status(200).json("User has been created.");
    });
  });
});

const form1 = asyncHandler(async (req, res) => {
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
    console.log("Result:", data);
    return res.status(200).json(data);
  });


})


const assign_supervisior = asyncHandler(async (req, res) => {
  console.log("Data from the frontend: ", req.body);

  const { class_id, examType, examName, durationFrom, durationTo, date, name } = req.body;

  if (!class_id || !examType || !examName || !durationFrom || !durationTo || !date || !name) {
      return res.status(400).json({ message: 'All fields are necessary!' });
  }

  const sql = `INSERT INTO Supervisor_faculty_mapping(class_id, duration_from, duration_to, exam_date, exam_type, exam, supervisor_id,assign) VALUES (?, ?, ?, ?, ?, ?, ?,?);`;

  console.log('SQL Query:', sql);
  console.log('Values:', [class_id, durationFrom, durationTo, date, examType, examName, name]);

  connection.query(sql, [class_id, durationFrom, durationTo, date, examType, examName, name,1], (err, result) => {
      if (err) {
          console.log('Database Error:', err);
          return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ message: 'Supervisor assigned successfully!' });
  });
});






const delete_notice = asyncHandler(async (req, res) => {
  const id = req.params.id;
  console.log("To Delete Notice:", id);


  const sql = 'DELETE FROM exam_notices WHERE notice_id=?';

  connection.query(sql, id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Deleted Successfully!!' });
  });
});

const get_faculty = asyncHandler(async (req, res) => {
  // Update query to set assign status to NULL
  const updateSql = `
    UPDATE supervisor_faculty_mapping
    SET assign = NULL, class_id=NULL
    WHERE duration_to < CURRENT_TIME()
    AND exam_date < CURRENT_DATE();
  `;

  // Select query to fetch faculty data
  const selectSql = `
    SELECT a.faculty_clg_id, a.name AS faculty_name, b.name, c.assign, c.class_id
    FROM faculty AS a
    LEFT JOIN department AS b ON a.depart_id = b.depart_id
    LEFT JOIN supervisor_faculty_mapping AS c ON a.faculty_clg_id = c.supervisor_id
    WHERE a.role IN (1, 9)
    ORDER BY a.faculty_clg_id;
  `;

  connection.query(updateSql, (updateErr) => {
    if (updateErr) {
      console.log(updateErr)
      return res.status(500).json({ error: updateErr.message });
    }

    connection.query(selectSql, (selectErr, data) => {
      if (selectErr) {
        return res.status(500).json({ error: selectErr.message });
      }
      res.status(200).json(data);
    });
  });
});


const edit_notice = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const file = req.file;
  console.log("To Edit Notice:", id, name, file);


  const sql = 'UPDATE exam_notices SET name=?, file=? WHERE notice_id=?';

  connection.query(sql, [id, name, file], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Edited Successfully!!' });
  });
});



module.exports = { get_faculty, view_notice, form1, assign_supervisior, delete_notice, edit_notice };