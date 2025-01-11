const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname))); // Serve static files (CSS, JS, images)

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Mongoose Schema and Model
const Contact = mongoose.model(
  "Contact",
  new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
    message: String,
  })
);

// Serve the contact.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "contact.html"));
});

// API Endpoint for Form Submission
app.post("/submit-form", async (req, res) => {
  const { firstName, lastName, email, phoneNumber, message } = req.body;

  try {
    const contact = new Contact({ firstName, lastName, email, phoneNumber, message });
    await contact.save();
    res.status(200).send("Form submitted successfully!");
  } catch (error) {
    console.error("Error saving form data:", error);
    res.status(500).send("Error saving form data");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
