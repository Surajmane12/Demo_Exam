const express = require("express");
const path = require('path'); // Make sure to require 'path' module
const router = express.Router();
const multer = require('multer');
const {mark_attendence,get_students_list,get_assigned_data,get_assigned_seats,assign_student_classroom,get_right_students,get_left_students, get_exam_type,get_exam_name,get_classrooms, get_branches,get_subjects,get_students,remove_data } = require("../../controller/ExamController/ExamController");

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

router.get('/get_exam_type', get_exam_type);
router.get('/get_exam_name', get_exam_name);
router.get('/get_class_info',get_classrooms)
router.get('/remove_data',remove_data)
router.get('/get_branches',get_branches)
router.get('/get_subjects/:branch_id/:semester',get_subjects)
router.get('/get_students',get_students)
router.get('/get_students_left',get_left_students)
router.get('/get_students_right',get_right_students)
router.get('/get_assigned_seats/:classroom/:examType/:seatType/:duration_from/:duration_to/:seatCount/:date',get_assigned_seats)
router.get('/get_assigned_students',get_students_list)
router.post('/assign_students',assign_student_classroom)
router.post('/mark_attendence',mark_attendence)
// router.post('/upload_notice', upload.single('file'), upload_notice); // Ensure field name matches the frontend
// router.post('/delete_notice/:notice_id', delete_notice);
// router.post('/update_notice/:id',upload.single('file'),edit_notice);


router.get('/get_assign_students/supervisor',get_assigned_data)

module.exports = router;
