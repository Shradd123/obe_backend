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

const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/admin', adminRoutes);

const departmentRoutes = require('./routes/deptRoutes'); // adjust path
app.use('/api', departmentRoutes); // ✅ must be registered

app.use('/', deptRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/programs', programRoutes);



app.use("/api/courses", courseRoutes);
app.use("/api/schemas", schemaRoutes);
app.use("/api/batch", batchRoutes);
app.use("/api/section", sectionRoutes);
app.use("/api/student", studentRoutes);

app.use('/sem', semRouter);
app.use('/batch-sem', batchSemRouter);


// const batchCourseRouter = require("./routes/batchCourseRouter");
// app.use("/api", batchCourseRouter);


const batchSemCoursesRouter = require('./routes/batchSemCoursesRouter');
app.use('/api', batchSemCoursesRouter);



const courseOfferingRoutes = require('./routes/courseOfferingRoutes');

app.use("/api/course-offerings", courseOfferingRoutes);

const teachingAssignmentRoutes = require("./routes/teachingAssignmentRoutes");

// Routes
app.use("/api/assignments", teachingAssignmentRoutes);

const courseCoverRoutes = require("./routes/courseCoverRoutes");
app.use("/api/course-cover-page", courseCoverRoutes);


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
