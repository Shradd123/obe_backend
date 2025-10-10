// routes/labManualRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const {
  addLabManual,
  getLabManualsByOffering,
  deleteLabManual,
} = require("../controllers/labManualController");

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "uploads", "lab-manuals"));
  },
  filename: function (req, file, cb) {
    // unique filename: timestamp-random-ext
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype !== "application/pdf") {
    cb(new Error("Only PDF files are allowed"), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } }); // 10 MB limit

// POST upload
// fields: offering_id (form field), uploaded_by (optional)
router.post("/", upload.single("manual"), addLabManual);

// GET /offering/:offering_id
router.get("/offering/:offering_id", getLabManualsByOffering);

// DELETE /:id
router.delete("/:id", deleteLabManual);

module.exports = router;
