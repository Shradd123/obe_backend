const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const poRoutes = require('../routes/poRoutes');
//const psoRoutes = require('./routes/poRoutes'); // your existing PSO routes
const courseController = require('../routes/poRoutes');
const app = express();
app.use(cors());
app.use(bodyParser.json());

const courseController = require('../controllers/courseController');

// GET all courses with department info
router.get('/with-department', courseController.getCoursesWithDept);

// PO routes
app.use('/api/po', poRoutes);

// PSO routes
//app.use('/api/pso', psoRoutes);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
