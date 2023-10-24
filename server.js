require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3001;

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
  })
);
app.options("/Contact", cors()); // Handle preflight requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASS = process.env.USER_PASS;

// API endpoint for placing the order
app.post("/", (req, res) => {
  const { full_name, email, device_type, device_name, plan, message } =
    req.body;
  const parseddata = {
    full_name: full_name,
    email: email,
    device_type: device_type,
    device_name: device_name,
    plan: plan,
    message: message,
  };
  res.json(parseddata);
  console.log(parseddata);
});
// Contact form endpoint
app.post("/Contact", (req, res) => {
  const { first_name, last_name, email, subject, message } = req.body;

  // Create reusable contactme object using the default SMTP transport
  const contactme = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: USER_EMAIL, // replace with your email
      pass: USER_PASS, // replace with your password or use an app password
    },

    secure: true,
  });

  // Setup email data
  let mailOptions = {
    from: USER_EMAIL,
    to: USER_EMAIL,
    subject: `${subject}`,
    html: `<p style="font-size: 20px;">Full Name: ${first_name} ${last_name}</p>
           <p style="font-size: 16px;">Email: <span style="font-weight: bold;">${email}</span></p>
           <p style="font-size: 16px;">Message: <span style="font-weight: bold; color: #e74c3c;">${message} </span></p>`,
  };

  // Send mail with defined transport object
  contactme.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);

    // Add this line to enable credentials in CORS
    res.header("Access-Control-Allow-Credentials", true);

    res.send("Message sent successfully");
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
