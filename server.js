const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 5001;

// ==============================
// Middleware
// ==============================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==============================
// Routes
// ==============================
const adminRoutes = require('./routes/adminRoutes');
const deptRoutes = require('./routes/deptRoutes');
const programRoutes = require('./routes/programRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const courseRoutes = require("./routes/courseRoutes");
const schemaRoutes = require("./routes/schemaRoutes");
const batchRoutes = require("./routes/batchRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const studentRoutes = require("./routes/studentRoutes");
const semRoutes = require('./routes/semRouter');
const batchSemRoutes = require('./routes/batchSemRouter');
const batchSemCoursesRoutes = require('./routes/batchSemCoursesRouter');
const courseOfferingRoutes = require("./routes/courseOfferingRoutes");
const teachingAssignmentRoutes = require("./routes/teachingAssignmentRoutes");
const courseCoverRoutes = require("./routes/courseCoverRoutes");
const visionMissionRoutes = require('./routes/visionMissionRoutes');
const peoRoutes = require('./routes/peoRoutes');
const timetableRoutes = require('./routes/timetableRouter');
const curriculumGapRoutes = require('./routes/curriculumGapRoutes');
const courseOutcomeRoutes = require('./routes/courseOutcomeRoutes');
const poRoutes = require('./routes/poRoutes'); // ✅ PO routes

// Use routes
app.use('/api/admin', adminRoutes);
app.use('/api/departments', deptRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/schemas', schemaRoutes);
app.use('/api/batch', batchRoutes);
app.use('/api/section', sectionRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/sem', semRoutes);
app.use('/api/batch-sem', batchSemRoutes);
app.use('/api/batch-sem-courses', batchSemCoursesRoutes);
app.use('/api/course-offerings', courseOfferingRoutes);
app.use('/api/assignments', teachingAssignmentRoutes);
app.use('/api/course-cover-page', courseCoverRoutes);
app.use('/api/vision-mission', visionMissionRoutes);
app.use('/api/peos', peoRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/curriculum-gaps', curriculumGapRoutes);
app.use('/api/course-outcome', courseOutcomeRoutes);
app.use('/api/po', poRoutes); // ✅ PO routes

// ==============================
// Start server
// ==============================
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
