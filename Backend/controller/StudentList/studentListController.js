const nodemailer = require('nodemailer');
const connection = require('../../config/dbConfig'); // Adjust the path accordingly
const asyncHandler = require('express-async-handler');

const view_table = asyncHandler(async (req, res) => {
  const deptID = req.query.department;

  let q = `SELECT a.stud_clg_id, b.name, c.bname, d.programm_name,e.status
  FROM students AS a
  LEFT JOIN student_personaldetails AS b ON a.sid = b.personal_id
  LEFT JOIN branch AS c ON a.branch_id = c.branch_id
  LEFT JOIN programm_type AS d ON a.programm_id = d.programm_id
  Left JOIN upload_exam_confirmation AS e on a.stud_clg_id = e.stud_clg_id`;


  let params = [];

  if (deptID) {
    q += ` WHERE c.branch_id = ?`;
    params.push(deptID);
  }

  q += ` LIMIT 20`;

  connection.query(q, params, (err, data) => {
    if (err) return res.json(err);
    console.log("Result:", data);
    return res.status(200).json(data);
  });
});

const search_table = asyncHandler(async (req, res) => {
  const searchQ = req.query.studentQuery || '';

  let q = `SELECT a.stud_clg_id, b.name, c.bname, d.programm_name
           FROM students AS a
           LEFT JOIN student_personaldetails AS b ON a.sid = b.personal_id
           LEFT JOIN branch AS c ON a.branch_id = c.branch_id
           LEFT JOIN programm_type AS d ON a.programm_id = d.programm_id
           WHERE a.stud_clg_id LIKE ? OR b.name LIKE ? OR c.bname LIKE ? OR d.programm_name LIKE ?`;

  const params = [`%${searchQ}%`, `%${searchQ}%`, `%${searchQ}%`, `%${searchQ}%`];

  connection.query(q, params, (err, data) => {
    if (err) return res.json(data);
    console.log("Result:", data);
    return res.status(200).json(data);
  });
});

const send_email = async (req, res) => {
  console.log("Email data:", req.params);

  try {
    const to = req.params.email;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false,
      },
      debug: true, // Enable debugging
      logger: true,
    });

    const info = await transporter.sendMail({
      from: 'vineshr4561@gmail.com',
      to: to,
      subject: 'Reminder: Exam Form Submission',
      text: 'Please submit your exam form as soon as possible.'
    });

    console.log("Email Sent Successfully!");
    res.json(info); // Send the response once
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { view_table, search_table, send_email };

// const nodemailer = require('nodemailer');
// const connection = require('../../config/dbConfig'); // Adjust the path accordingly
// const asyncHandler = require('express-async-handler');

// const view_table = asyncHandler(async (req, res) => {

//   const deptID = req.query.department;
//   // const searchQ = req.query.searchQuery || '';


//   let q = `select a.stud_clg_id,b.name,c.bname,d.programm_name
//     from students as a
//     left join student_personaldetails as b 
//     on a.sid = b.personal_id
//     left join branch as c
//     on a.branch_id = c.branch_id
//     left join programm_type as d
//     on a.programm_id=d.programm_id`;

//   let params = [];

//   if (deptID) {
//     q += ` where c.branch_id = ?`;
//     params.push(deptID);
//   }


//   q += ` LIMIT 20`;

//   connection.query(q, params, (err, data) => {
//     if (err) return res.json(err);
//     console.log("Result:", data);
//     return res.status(200).json(data);
//   });

// })


// const search_table = asyncHandler(async (req, res) => {

//   console.log("search:", req.body)
//   const searchQ = req.query.studentQuery || '';

//   let q = `SELECT a.stud_clg_id, b.name, c.bname, d.programm_name
//   FROM students AS a
//   LEFT JOIN student_personaldetails AS b 
//   ON a.sid = b.personal_id
//   LEFT JOIN branch AS c
//   ON a.branch_id = c.branch_id
//   LEFT JOIN programm_type AS d
//   ON a.programm_id = d.programm_id
//   WHERE a.stud_clg_id LIKE ? oR b.name LIKE ? OR c.bname LIKE ? OR d.programm_name LIKE ?`;

//   const params = [`%${searchQ}%`, `%${searchQ}%`, `%${searchQ}%`, `%${searchQ}%`];

//   connection.query(q, params, (err, data) => {
//     if (err) return res.json(data);
//     console.log("Result:", data);
//     return res.status(200).json(data);
//   })

// })

// const send_email = async (req, res) => {
//   console.log("Email data : ", req.body);
//   let q=``;

//   try {
//     const { to, subject, text } = req.body;

//     // Calculate total price and format product details
//     // const totalPrice = productData.reduce((total, item) => total + item.total_price, 0);
//     // const productList = productData.map(item => ({
//     //     name: item.product_name,
//     //     quantity: item.quantity,
//     //     price: item.total_price
//     // }));

//     // Create a Nodemailer transporter
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       host: process.env.SMTP_HOST,
//       port: process.env.SMTP_PORT,
//       secure: false,
//       auth: {
//         user: process.env.SMTP_EMAIL,
//         pass: process.env.SMTP_PASSWORD
//       },
//       tls: {
//         rejectUnauthorized: false,
//       },
//       debug: true, // Enable debugging
//       logger: true,
//     });

//     // Define email options with dynamic content
//     const info = await transporter.sendMail({
//       from: '"Exam Section" <vineshr4561@gmail.com>',
//       to: to,
//       subject:subject,
//       // text: text,
//       // html: `<p>Dear Customer,</p>

//       //   <p>Thank you for placing your order with us! We're thrilled to confirm that your order has been successfully processed and will be on its way to you shortly.</p>

//       //   <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
//       //     <thead>
//       //       <tr>
//       //         <th style="border: 1px solid #ddd; padding: 8px;">Product Name</th>
//       //         <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
//       //         <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
//       //       </tr>
//       //     </thead>
//       //     <tbody>
//       //       // ${productList.map(({ name, quantity, price }) => `
//       //       //   <tr>
//       //       //     <td style="border: 1px solid #ddd; padding: 8px;">${name}</td>
//       //       //     <td style="border: 1px solid #ddd; padding: 8px;">${quantity}</td>
//       //       //     <td style="border: 1px solid #ddd; padding: 8px;">₹ ${price}/-</td>
//       //       //   </tr>
//       //       // `).join('')}
//       //     </tbody>
//       //   </table>

//       //   // <p><strong>Total Amount:</strong> ₹ ${totalPrice}</p>

//       //   <p>You will receive an email with tracking information once your order ships. If you have any questions or need further assistance, please feel free to contact us.</p>

//       //   <p>Thank you again for choosing us. We look forward to serving you again soon!</p>`
//       html: text
//     });

//     console.log("Email Sent Successfully!");
//     res.json(info); // Send the response once
//   } catch (error) {
//     console.error('Error sending email:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// module.exports = { view_table, search_table, send_email };