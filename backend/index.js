require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");

mongoose.connect(config.connectionString);

const User = require("./models/user.model");
const Pdf = require("./models/pdf.model");
const { authenticateToken } = require("./utilities");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../public/uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = function (req, file, cb) {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

//Upload PDF
app.post(
  "/upload-pdf",
  authenticateToken,
  upload.single("pdf"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ error: true, message: "No PDF file uploaded!" });
      }

      // Save PDF metadata to MongoDB
      const { filename, originalname, path: filePath } = req.file;
      const uploadedBy = req.user.user._id; // Assuming req.user is set by authenticateToken middleware

      const pdf = new Pdf({
        filename: filename,
        originalFilename: originalname, // Save the original file name
        path: filePath,
        uploadedBy: uploadedBy,
      });

      await pdf.save();

      res
        .status(201)
        .json({ error: false, message: "PDF uploaded successfully!", pdf });
    } catch (error) {
      console.error("Error uploading PDF:", error);
      res.status(500).json({ error: true, message: "Failed to upload PDF." });
    }
  }
);

// GET endpoint to fetch all uploaded PDFs
app.get("/pdfs", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user._id; // Get the current user's ID from the token

    const pdfs = await Pdf.find({ uploadedBy: userId }).populate(
      "uploadedBy",
      "fullName email"
    );
    res.status(200).json({ error: false, pdfs });
  } catch (error) {
    console.error("Error fetching PDFs:", error);
    res.status(500).json({ error: true, message: "Failed to fetch PDFs." });
  }
});

//Create Account
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({
      error: true,
      message: "Full name, email, and password are required.",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: true, message: "User already exists with this email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const accessToken = jwt.sign(
      { user: newUser },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "36000m",
      }
    );

    return res.json({
      error: false,
      user: {
        fullName: newUser.fullName,
        email: newUser.email,
        _id: newUser._id,
        createdOn: newUser.createdOn,
      },
      accessToken,
      message: "Registration successful.",
    });
  } catch (error) {
    console.error("Error creating account:", error);
    return res
      .status(500)
      .json({ error: true, message: "Failed to create account." });
  }
});

app.delete("/delete-pdf/:id", authenticateToken, async (req, res) => {
  const userId = req.user.user._id; // Get user ID from authenticated token
  const pdfId = req.params.id; // Get PDF ID from request parameters

  try {
    // Check if the PDF exists and is uploaded by the current user
    const pdf = await Pdf.findOne({ _id: pdfId, uploadedBy: userId });

    if (!pdf) {
      return res.status(404).json({ error: true, message: "PDF not found or you are not authorized to delete it." });
    }

    // Delete the PDF document from MongoDB
    await Pdf.findByIdAndDelete(pdfId);

    // Optionally, delete the physical file from storage using fs.unlinkSync(pdf.path);

    res.status(200).json({ error: false, message: "PDF deleted successfully." });
  } catch (error) {
    console.error("Error deleting PDF:", error);
    res.status(500).json({ error: true, message: "Failed to delete PDF." });
  }
});

// Login Process
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: true, message: "User not found." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid credentials." });
    }

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m",
    });

    return res.json({
      error: false,
      user: {
        fullName: user.fullName,
        email: user.email,
        _id: user._id,
        createdOn: user.createdOn,
      },
      accessToken,
      message: "Login successful.",
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ error: true, message: "Failed to log in." });
  }
});

//Get User
app.get("/get-user", authenticateToken, async (req, res) => {
  const { user } = req.user;

  const isUser = await User.findOne({ _id: user._id });
  if (!isUser) {
    return res.sendStatus(401);
  }
  return res.json({
    user: {
      fullName: isUser.fullName,
      email: isUser.email,
      _id: isUser._id,
      createdOn: isUser.createdOn,
    },
    message: "",
  });
});

app.listen(8000);

module.exports = app;
