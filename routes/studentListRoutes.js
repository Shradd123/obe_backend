// import express from "express";
// import {
//   uploadStudentList,
//   getStudentLists,
//   deleteStudentList,
//   upload
// } from "../controllers/studentListController.js";

// const router = express.Router();

// // Upload (PDF or JSON)
// router.post("/upload", upload.single("file"), uploadStudentList);

// // Get all lists for a specific offering
// router.get("/:offering_id", getStudentLists);

// // Delete a list
// router.delete("/:id", deleteStudentList);

// export default router;
const express = require("express");
const {
  uploadStudentList,
  getStudentLists,
  deleteStudentList,
  upload,
} = require("../controllers/studentListController");

const router = express.Router();

// Upload (PDF or JSON)
router.post("/upload", upload.single("file"), uploadStudentList);

// Get all lists for a specific offering
router.get("/:offering_id", getStudentLists);

// Delete a list
router.delete("/:id", deleteStudentList);

module.exports = router;
