const bcrypt = require('bcrypt');
const connection = require('../../config/dbConfig'); // Adjust the path accordingly
const asyncHandler = require('express-async-handler'); // If not installed, run `npm install express-async-handler`
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const moment=require('moment');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.resolve('controller/ExamController/Uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Use the original file name
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });






const get_exam_type = asyncHandler(async (req, res) => {

  const q = `SELECT * from exam_type;`;

  connection.query(q, (err, data) => {
    if (err) return res.json(err);
    // console.log("Result:",data);
    return res.status(200).json(data);
  });


})


const get_exam_name = asyncHandler(async (req, res) => {

  const q = `SELECT * from exam_name;`;

  connection.query(q, (err, data) => {
    if (err) return res.json(err);
    // console.log("Result:",data);
    return res.status(200).json(data);
  });


})

const get_classrooms = asyncHandler(async (req, res) => {
  const q = `SELECT * from classrooms;`;
  connection.query(q, (err, data) => {
      if (err) return res.json(err);
      console.log("Result:", data);
      return res.status(200).json(data);
  });
});



const get_subjects = asyncHandler(async (req, res) => {
  console.log(req.params.branch_id)

  const { branch_id, semester } = req.params;
  console.log("Branch ID:", branch_id)
  const q = `SELECT * from subjects where branch_id=? AND semester=?;`;

  connection.query(q, [branch_id, semester], (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    console.log("Result:", data);
    return res.status(200).json(data);
  });


})


const get_students = asyncHandler(async (req, res) => {
  console.log(req.query)
  const { branch, semester, academicYear } = req.query;


  const q = `SELECT stud_clg_id,branch_id,programm_id from students WHERE branch_id=? AND programm_id=? AND academic_year=?;`;

  connection.query(q, [branch, semester, academicYear], (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    console.log("Result:", data);
    return res.status(200).json(data);
  });


})

const remove_data= asyncHandler(async (req, res) => {

  const q = `
    DELETE FROM student_classroom_mapping
    WHERE exam_date < CURDATE()
    OR (exam_date = CURDATE() AND STR_TO_DATE(duration_to, '%H:%i:%s') < CURTIME());
  `;

  connection.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
   
    res.status(200).send({ msg: 'Data updated!!' });
  });


})

const get_left_students = asyncHandler(async (req, res) => {
  console.log(req.query)
  const { branch, semester, academicYear } = req.query;


  const q = `
  SELECT 
    a.stud_clg_id,
    a.branch_id,
    a.programm_id
FROM 
    students AS a
WHERE 
    a.branch_id = ? 
    AND a.programm_id = ? 
    AND a.academic_year = ?
    AND NOT EXISTS (
        SELECT 1 
        FROM student_classroom_mapping AS b 
        WHERE b.student_id = a.stud_clg_id
    );

  `;

  connection.query(q, [branch, semester, academicYear], (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    console.log("Result:", data);
    return res.status(200).json(data);
  });


})


const get_right_students = asyncHandler(async (req, res) => {
  console.log(req.query)
  const { branch, semester, academicYear } = req.query;


  const q = `
  SELECT 
    a.stud_clg_id,
    a.branch_id,
    a.programm_id
FROM 
    students AS a
WHERE 
    a.branch_id = ? 
    AND a.programm_id = ? 
    AND a.academic_year = ?
    AND NOT EXISTS (
        SELECT 1 
        FROM student_classroom_mapping AS b 
        WHERE b.student_id = a.stud_clg_id
    );

  `;

  
  connection.query(q, [branch, semester, academicYear], (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    console.log("Result:", data);
    return res.status(200).json(data);
  });


})

const assign_student_classroom = asyncHandler(async (req, res) => {
  console.log("API Called !!")
  console.log(req.body);

  const {
    branch,
    classroom,
    examType,
    seatType,
    date,
    duration_from,
    duration_to,
    left_students,
    right_students,
    semester
  } = req.body;

  // Prepare data for insertion
  const data = [
    ...left_students.map(stud_clg_id => [branch, classroom, semester, examType, seatType, date, duration_from, duration_to, stud_clg_id, 1, 0]), // 1 for left side, 0 for right side
    ...right_students.map(stud_clg_id => [branch, classroom, semester, examType, seatType, date, duration_from, duration_to, stud_clg_id, 0, 1]) // 0 for left side, 1 for right side
  ];

  const insertAssignmentsQuery = `
    INSERT INTO student_classroom_mapping (branch_id, room_number, programm_id, exam_type, seat_type, exam_date, duration_from, duration_to, student_id, left_side, right_side)
    VALUES ?
  `;

  connection.query(insertAssignmentsQuery, [data], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to submit assignments' });
      return;
    }

    // Respond with success
    res.status(200).json({ message: 'Assignments submitted successfully' });
  });
});

const mark_attendence = asyncHandler(async (req, res) => {
  console.log("API Called !!");
  console.log(req.body);

  const { student_ids, date, duration_from, duration_to } = req.body;

  const [day, month, year] = date.split('/');
  const formattedExamDate = `${year}-${month}-${day}`;
  const exam_date=formattedExamDate; 
  if (!student_ids || student_ids.length === 0) {
    return res.status(400).json({ error: 'No student IDs provided' });
  }

  // Build the IN clause with placeholders
  const placeholders = student_ids.map(() => '?').join(',');

  const mark_present_query = 
  `   
   UPDATE student_classroom_mapping 
    SET attendence = 1 
    WHERE student_id IN (${placeholders}) 
    AND duration_from = ? 
    AND duration_to = ? 
    AND exam_date = ?;`;

  // Create an array with the student_ids followed by the other parameters
  const queryParams = [...student_ids, duration_from, duration_to, exam_date];

  console.log("Query:", mark_present_query);
  console.log("Parameters:", queryParams);

  connection.query(mark_present_query, queryParams, (err, results) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ error: 'Failed to mark attendance' });
    }

    console.log("Results:", results);
    res.status(200).json({ message: 'Attendance marked successfully!' });
  });
});



const get_assigned_seats = asyncHandler(async (req, res) => {

  const { classroom, examType, seatType, duration_from, duration_to, seatCount, date } = req.params;

  console.log("Params Data: ", req.params)

  const q = `SELECT student_id as stud_clg_id ,left_side,right_side from student_classroom_mapping WHERE room_number=? AND exam_type=? AND seat_type=? AND duration_from=? AND duration_to=?;`;

  connection.query(q, [classroom, examType, seatType, duration_from, duration_to, seatCount, date], (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    console.log("Result:", data);
    return res.status(200).json(data);
  });


})

const get_branches = asyncHandler(async (req, res) => {

  const q = `SELECT * from branch;`;

  connection.query(q, (err, data) => {
    if (err) return res.json(err);
    console.log("Result:", data);
    return res.status(200).json(data);
  });


})







const upload_marks = asyncHandler(async (req, res) => {

  console.log("Data:", req.body);
  const data = req.body;

  if (!data.length) {
    return res.status(400).send('No data provided');
  }

  const { sub_code, sem, acad_year } = data[0]; // Assuming these fields are present in each row
  const tableName = `${sub_code}_${sem}_${acad_year}`;

  // SQL to check if table exists
  const checkTableSQL = `
      SELECT COUNT(*)
      AS tableExists
      FROM information_schema.tables
      WHERE table_schema = 'your_database_name' AND table_name = ?
    `;

  connection.query(checkTableSQL, [tableName], (err, results) => {
    if (err)
      console.log(err)
    throw err;

    if (results[0].tableExists) {
      // If table exists, directly insert the data
      insertDataIntoTable(tableName, data, res);
    } else {
      // If table does not exist, create the table and then insert the data
      const createTableSQL = `
          CREATE TABLE ${tableName} (
            branch_id VARCHAR(255),
            sub_code VARCHAR(255),
            stud_id VARCHAR(255),
            IA1 FLOAT,
            IA2 FLOAT,
            AVG FLOAT,
            semester_marks FLOAT,
            oral_practical FLOAT
          )
        `;

      connection.query(createTableSQL, (err) => {
        if (err) throw err;

        insertDataIntoTable(tableName, data, res);
      });
    }
  });
});

// const insertDataIntoTable = (tableName, data, res) => {
//   const sql = `
//     INSERT INTO results  (branch_id, sub_code, stud_id, IA1, IA2, AVG, semester_marks, oral_practical)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//   `;

//   data.forEach((row) => {
//     const values = [
//       row.branch_id,
//       row.sub_code,
//       row.stud_id,
//       row.IA1,
//       row.IA2,
//       row.AVG,
//       row.semester_marks,
//       row.oral_practical,
//     ];

//     connection.query(sql, values, (err) => {
//       console.log(err);
//       if (err) throw err;
//     });
//   });

//   res.send('Data successfully inserted into the database');
// };




// Use UUID to generate unique IDs

const insertDataIntoTable = (req, res) => {
  const { branch_id, subject_code, academic_year, semester, user_id } = req.body;
  const data = JSON.parse(req.body.data); // Parse the JSON string back to an array
  const file = req.file; // The uploaded file

  if (!branch_id || !subject_code || !academic_year || !data || !semester || !file || !user_id) {
    return res.status(400).send('Invalid request payload');
  }

  const generateReportId = () => {
    return Math.floor(100 + Math.random() * 900); // Generates a random integer between 100 and 999
  };

  const report_id = generateReportId(); // Generate a unique report_id

  const sqlInsertResults = `
      INSERT INTO results (sub_code, stud_id, IA1, IA2, AVG, academic_year, branch_id, semester, report_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

  const sqlInsertHistory = `
      INSERT INTO exam_reports_history (report_id, file, user_id, upload_date)
      VALUES (?, ?, ?, ?)
    `;

  const currentDate = new Date();

  data.forEach((row) => {
    const values = [
      subject_code,
      row.ID,
      row.IA1,
      row.IA2,
      row.AVG,
      academic_year,
      branch_id,
      semester,
      report_id // Include the report_id in the results table
    ];

    connection.query(sqlInsertResults, values, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send('Error inserting data into the database');
      }
    });
  });

  const historyValues = [report_id, file.filename, user_id, currentDate];

  connection.query(sqlInsertHistory, historyValues, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error inserting data into exam_reports_history');
    }
    res.send('Data successfully inserted into the database and history table');
  });
};

module.exports = { insertDataIntoTable };





const show_result = asyncHandler(async (req, res) => {

  const { sub_code, acad_year } = req.params;
  console.log("For getting result:", req.params);
  const q = `SELECT * from results where sub_code=? AND academic_year=?;`;

  connection.query(q, [sub_code, acad_year], (err, data) => {
    if (err) return res.json(err);
    // console.log("Result:",data);
    return res.status(200).json(data);
  });


})

const get_uploaded_result = asyncHandler(async (req, res) => {

  const { user_id } = req.params;
  console.log("For getting result:", req.params);
  const q = `SELECT * from exam_reports_history where user_id=?;`;

  connection.query(q, [user_id], (err, data) => {
    if (err) return res.json(err);
    // console.log("Result:",data);
    return res.status(200).json(data);
  });



})


const get_assigned_data = asyncHandler(async (req, res) => {

  const q = `
  
SELECT 
    a.supervisor_id,
    a.duration_from,
    a.duration_to,
    a.exam_date,
    a.exam,
    b.room_number,
    c.name,
    COUNT(*) AS assigned
FROM 
    supervisor_faculty_mapping AS a
LEFT JOIN 
    student_classroom_mapping AS b 
ON 
    a.duration_from = b.duration_from 
    AND a.duration_to = b.duration_to 
    AND a.exam_date = b.exam_date
LEFT JOIN 
    faculty AS c 
ON 
    a.supervisor_id = c.faculty_clg_id
GROUP BY 
    a.supervisor_id, 
    a.duration_from, 
    a.duration_to, 
    a.exam_date, 
    b.room_number, 
    c.name;
 `;

  connection.query(q, (err, data) => {

    if (err) 
      {
        console.log(err);
        return res.json(err)
      };
    return res.status(200).json(data);
  });



})



const get_students_list = asyncHandler(async (req, res) => {

  console.log("Data come for getting list : ",req.query)

  // const formattedExamDate = new Date(req.query.exam_date).toISOString().split('T')[0];
  const [day, month, year] = req.query.exam_date.split('/');
  const formattedExamDate = `${year}-${month}-${day}`; // Convert to 'YYYY-MM-DD'
  const supervisor_id = req.query.supervisor_id;
  const room_number = req.query.class;
  const exam = req.query.exam;


const exam_date=formattedExamDate;
console.log("Exam Date: ",exam_date)
// const exam_date_ist = new Date(req.query.exam_date).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
// const exam_date = new Date(exam_date_ist).toISOString();
  const duration_from = req.query.duration_from;
  const duration_to = req.query.duration_to;
   
  const q = `
  SELECT a.stud_clg_id, c.name, d.bname, e.programm_name,g.supervisor_id,f.duration_from,f.duration_to,f.room_number,f.attendence,g.exam_date
  FROM students AS a
  left join student_doc_link as b on a.doc_ids=b.doc_id
  left join student_personaldetails as c on a.personal_details_id=c.personal_id
  left join branch as d on a.branch_id=d.branch_id
  LEFT JOIN programm_type AS e ON a.programm_id = e.programm_id
  Left JOIN student_classroom_mapping AS f on a.stud_clg_id = f.student_id
  LEFT JOIN  supervisor_faculty_mapping as g ON f.room_number=g.class_id
  WHERE c.name IS NOT NULL AND f.duration_from=g.duration_from AND f.duration_to=g.duration_to AND g.supervisor_id=? AND g.class_id=? AND g.exam=? AND g.exam_date=? AND g.duration_from=? AND g.duration_to=?;
 `;


  connection.query(q,[supervisor_id,room_number,exam,exam_date,duration_from,duration_to],(err, data) => {
    if (err) {

      console.log(err);
      return res.json(err);

  }
  else{

    console.log(data);
    return res.status(200).json(data);

  }
  });



})









module.exports = {
  get_subjects,
  get_branches,
  get_classrooms,
  get_exam_type,
  get_exam_name,
  upload_marks,
  show_result,
  insertDataIntoTable,
  upload,
  remove_data,
  get_uploaded_result,
  get_students,
  get_left_students,
  get_right_students,
  assign_student_classroom,
  get_assigned_seats,
  get_assigned_data,
  get_students_list,
  mark_attendence

};
