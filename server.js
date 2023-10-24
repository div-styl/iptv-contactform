require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;
const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASS = process.env.USER_PASS;

const emailconfig = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: USER_EMAIL, // replace with your email
    pass: USER_PASS, // replace with your password or use an app password
  },
  secure: true,
});

// Middleware
app.use(
  cors({
    origin: [
      "http://nexgenstream.me",
      "https://nexgenstream.me",
      "http://localhost:5173/",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  }));
app.options("/Contact", cors()); // Handle preflight requests
app.options("/", cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API endpoint for placing the order

app.post("/", (req, res) => {
  const { full_name, email, device_type, device_name, plan, message } =
    req.body;
  console.log(req.body);

  // Setup email data
  const mailOptions = {
    from: email,
    to: USER_EMAIL,
    subject: "New Order", // Change this subject as needed
    html: `
      <p style="font-size: 20px;">Full Name: ${full_name}</p>
      <p style="font-size: 16px;">Email: <span style="font-weight: bold;">${email}</span></p>
      <p style="font-size: 16px;">Device Type: <span style="font-weight: bold;">${device_type}</span></p>
      <p style="font-size: 16px;">Device Name: <span style="font-weight: bold;">${device_name}</span></p>
      <p style="font-size: 16px;">Plan: <span style="font-weight: bold;">${plan}</span></p>
      <p style="font-size: 16px;">Message: <span style="font-weight: bold; color: #e74c3c;">${message} </span></p>
    `,
  };

  // Send the email
  emailconfig.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Message sent: %s", info.messageId);
      res.header("Access-Control-Allow-Credentials", true);
      res.send("Message sent successfully");
    }
  });
});

// Contact form endpoint
app.post("/Contact", (req, res) => {
  const { first_name, last_name, email, subject, message } = req.body;

  // Setup email data
  const mailOptions = {
    from: USER_EMAIL,
    to: USER_EMAIL,
    subject: `${subject}`,
    html: `
      <p style="font-size: 20px;">Full Name: ${first_name} ${last_name}</p>
      <p style="font-size: 16px;">Email: <span style="font-weight: bold;">${email}</span></p>
      <p style="font-size: 16px;">Message: <span style="font-weight: bold; color: #e74c3c;">${message} </span></p>
    `,
  };

  // Send the email
  emailconfig.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Message sent: %s", info.messageId);
      res.header("Access-Control-Allow-Credentials", true);
      res.send("Message sent successfully");
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
