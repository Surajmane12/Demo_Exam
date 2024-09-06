const express = require("express");
const { get_faculty, assign_supervisior } = require("../../controller/SupervisorAssign/AssignSupervisorController");
const router=express.Router();



router.get('/get_faculty',get_faculty);

router.post('/assign_supervisior',assign_supervisior);


module.exports = router;