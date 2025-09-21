const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Routes
const adminRoutes = require('./routes/adminRoutes');
const deptRoutes = require('./routes/deptRoutes');
const programRoutes = require('./routes/programRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const courseRoutes = require("./routes/courseRoutes");
const schemaRoutes = require("./routes/schemaRoutes");
const batchRoutes = require("./routes/batchRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const studentRoutes = require("./routes/studentRoutes");
const semRouter = require('./routes/semRouter');
const batchSemRouter = require('./routes/batchSemRouter');
const batchSemCoursesRouter = require('./routes/batchSemCoursesRouter');
const courseOfferingRoutes = require("./routes/courseOfferingRoutes");
const teachingAssignmentRoutes = require("./routes/teachingAssignmentRoutes");
const courseCoverRoutes = require("./routes/courseCoverRoutes");
const visionMissionRoutes = require('./routes/visionMissionRoutes');
const peoRoutes = require('./routes/peoRoutes');
const timetableRoutes = require('./routes/timetableRouter'); // ✅ timetable router

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploaded files statically (e.g., timetables, course covers, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/departments', deptRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/programs', programRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/schemas", schemaRoutes);
app.use("/api/batch", batchRoutes);
app.use("/api/section", sectionRoutes);
app.use("/api/student", studentRoutes);
app.use('/sem', semRouter);
app.use('/batch-sem', batchSemRouter);
app.use('/api', batchSemCoursesRouter);
app.use("/api/course-offerings", courseOfferingRoutes);
app.use("/api/assignments", teachingAssignmentRoutes);
app.use("/api/course-cover-page", courseCoverRoutes);
app.use('/api/vision-mission', visionMissionRoutes);
app.use('/api/peos', peoRoutes);
app.use('/api/timetable', timetableRoutes); // ✅ timetable routes mounted
const curriculumGapRoutes = require('./routes/curriculumGapRoutes');
app.use('/api', curriculumGapRoutes);
const courseOutcomeRoutes = require('./routes/courseOutcomeRoutes');
app.use('/api/course-outcome', courseOutcomeRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
