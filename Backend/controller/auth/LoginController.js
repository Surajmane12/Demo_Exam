

const bcrypt = require('bcrypt');
const connection = require('../../config/dbConfig'); // Adjust the path accordingly
const asyncHand= require('express-async-handler'); // If not installed, run `npm install express-async-handler`
const jwt = require("jsonwebtoken");
const secretKey = process.env.DB_SCERET_KEY;

const login = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  const searchQuery = "SELECT * FROM exam_section_user WHERE email = ?";

  try {
    connection.query(searchQuery, [email], async (err, results) => {
      if (err) {
        console.error("Error running the query: ", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid credentials", reason: "username or password incorrect" });
      } else {
        const user = results[0];
        console.log("user data: ", user);

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          return res.status(401).json({ message: "Invalid credentials", reason: "username or password incorrect" });
        }

        let role = 1;
        // if (user.email === 'examsection@pvppocoe.ac.in') {
        //   role = 1;
        // } else {
        //   role = 2;
        // }

        const tokenPayload = {
          uid: user.email,
          user_type: user.user_type,
          role: role
        };

        const token = jwt.sign(tokenPayload, secretKey, { expiresIn: "1h" });

        res.status(200).json({
          message: "Logged in successfully",
          token: token,
          uid: user.email,
          user_type: user.user_type,
          role: role
        });
      }
    });
  } catch (error) {
    console.error("Error running the query: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

  module.exports={login}