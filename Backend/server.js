// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const corsOptions = require('./middleware/corsMiddleware/corsMiddleware'); // Adjust the path as needed

const app = express();

// Use CORS middleware with options
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Define other middlewares and routes
// app.use('/some-route', someRouter);
const notices_routes=require('./routes/noticeroutes');
const studentList_routes=require('./routes/studentlistroutes');
const hallTicket_routes=require('./routes/hallticketroutes');
const assign_supervisior=require('./routes/Supervisor/assignSuperRoutezzs')
// const view_document=require('./routes/view_document')
// app.use('/uploads/',express.static('./uploads/'))
const exam_routes=require('./routes/Exam/exam_routes')
const durationroutes = require('./routes/durationroutes')
const marksroutes=require('./routes/marksroutes')
const student_exam_confi_upload=require('./routes/studentConfiRoutes')
const login =require('./routes/LoginRoutes/login')

app.use('/notice',notices_routes);
app.use('/admin',studentList_routes);
app.use('/admin/hallTicket',hallTicket_routes)
app.use('/supervisor_assign',assign_supervisior)
// app.use('/student/upload',hallTicket_routes);

// const notices_routes=require('./routes/noticeroutes')
// app.use('/notice',notices_routes)
// app.use('/notice',view_document)
app.use('/exam',exam_routes)
app.use('/duration',durationroutes)
app.use('/results',marksroutes)

app.use('/student_confi',student_exam_confi_upload)
app.use('/auth',login)


const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
