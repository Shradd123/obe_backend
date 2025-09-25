const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const teachingAssignmentRoutes = require("./routes/teachingAssignmentRoutes");
const courseCoverRoutes = require("./routes/courseCoverRoutes");
const visionMissionRoutes = require('./routes/visionMissionRoutes');
const peoRoutes = require('./routes/peoRoutes');
const timetableRoutes = require('./routes/timetableRouter'); // ✅ timetable router
const curriculumGapRoutes = require('./routes/curriculumGapRoutes');
const courseOutcomeRoutes = require('./routes/courseOutcomeRoutes');
const poRoutes = require('./routes/poRoutes'); // ✅ PO routes

const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
app.use('/', deptRoutes);
app.use('/api', require('./routes/deptRoutes'));

app.use('/api/admin', adminRoutes);
app.use('/api/departments', deptRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/schemas', schemaRoutes);
app.use('/api/batch', batchRoutes);
app.use('/api/section', sectionRoutes);
app.use('/api/student', studentRoutes);
app.use('/sem', semRouter);
app.use('/batch-sem', batchSemRouter);
app.use('/api', batchSemCoursesRouter);
app.use("/api/course-offerings", courseOfferingRoutes);
app.use("/api/assignments", teachingAssignmentRoutes);
app.use("/api/course-cover-page", courseCoverRoutes);
app.use('/api/vision-mission', visionMissionRoutes);
app.use('/api/peos', peoRoutes);
app.use('/api/timetable', timetableRoutes); // ✅ timetable routes mounted
app.use('/api', curriculumGapRoutes);
app.use('/api/course-outcome', courseOutcomeRoutes);

// ✅ PO routes
app.use('/api/po', poRoutes);
const tsoRoutes = require("./routes/tsoRoutes");
app.use("/api/tso", tsoRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
