const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
require("dotenv").config();


const app = express();
app.use(cors());
app.use(express.json());

// Root route for testing
app.get("/", (req, res) => {
  res.send("🚀 Bulk Mail Backend is running!");
});

// Connect to MongoDB using environment variable
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to DB"))
  .catch(() => console.log("❌ Failed to connect to DB"));




// Mongoose model
const Credential = mongoose.model("credential", {}, "bulkmail");

// POST route to send email
app.post("/sendemail", async (req, res) => {
  const { msg, emailList } = req.body;

  if (!msg || !emailList || emailList.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Message or email list is missing",
    });
  }

  try {
    const data = await Credential.find();

    if (!data || data.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No credentials found in DB",
      });
    }

    // Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: data[0].user,
        pass: data[0].pass, // Ideally use an app password
      },
    });

    let sentCount = 0;
    let failed = false;

    for (let email of emailList) {
      try {
        await transporter.sendMail({
          from: data[0].user,
          to: email,
          subject: "A Message from Bulk Mail App",
          text: msg,
        });
        console.log("Email sent to:", email);
        sentCount++;
      } catch (err) {
        console.log("Mail error:", err);
        failed = true;
      }
    }

    if (failed) {
      return res.json({ success: false, message: "Some emails failed ❌" });
    }

    return res.json({ success: true, message: "All emails sent ✅" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error ❌" });
  }
});

// Use dynamic port from Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}...`);
});