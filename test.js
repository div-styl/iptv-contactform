require('dotenv').config(); 
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Contact form endpoint
app.post('/Contact', (req, res) => {
  const { firstName, lastName, email,subject , message } = req.body;

  // Create reusable transporter object using the default SMTP transport
  const USER_EMAIL = process.env.USER_EMAIL;
  const USER_PASS = process.env.USER_PASS;
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: USER_EMAIL, // replace with your email
      pass: USER_PASS, // replace with your password or use an app password
    },

    secure: true,
  });

  // Setup email data
  let mailOptions = {
    from: 'gouhmada@gmail.com',
    to: 'gouhmada@gmail.com',
    subject: `${subject}`, // Use backticks instead of single quotes
    text: `Firstname: ${firstName}\nLastname: ${lastName}\nEmail: ${email}\n\n Message: ${message}`
  };


  // Send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    res.send('Message sent successfully');
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});