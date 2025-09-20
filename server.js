const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

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
const courseOfferingRoutes = require('./routes/courseOfferingRoutes');
const teachingAssignmentRoutes = require("./routes/teachingAssignmentRoutes");
const courseCoverRoutes = require("./routes/courseCoverRoutes");
const visionMissionRoutes = require('./routes/visionMissionRoutes');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Admin routes
app.use('/api/admin', adminRoutes);

// Department routes
app.use('/api/departments', deptRoutes);

// Faculty & Program routes
app.use('/api/faculty', facultyRoutes);
app.use('/api/programs', programRoutes);

// Course & schema routes
app.use("/api/courses", courseRoutes);
app.use("/api/schemas", schemaRoutes);

// Batch, section, student routes
app.use("/api/batch", batchRoutes);
app.use("/api/section", sectionRoutes);
app.use("/api/student", studentRoutes);

// Semester & batch-semester routes
app.use('/sem', semRouter);
app.use('/batch-sem', batchSemRouter);
app.use('/api', batchSemCoursesRouter);

// Course offerings & teaching assignments
app.use("/api/course-offerings", courseOfferingRoutes);
app.use("/api/assignments", teachingAssignmentRoutes);

// Course cover & vision-mission routes
app.use("/api/course-cover-page", courseCoverRoutes);
app.use('/api/vision-mission', visionMissionRoutes);
const peoRoutes = require('./routes/peoRoutes');
// ...
app.use('/api/peos', peoRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
