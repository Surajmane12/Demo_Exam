const express = require("express");
const {view_table, send_email}= require("../controller/StudentList/studentListController")
const router = express.Router();

router.get('/studentList', view_table);
router.post('/sendEmail/:email', send_email);
// router.get('/view_table/search', search_table);

module.exports = router;