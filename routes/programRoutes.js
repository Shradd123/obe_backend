const express = require('express');
const router = express.Router();
const { addProgram,
    getProgramsByAdmin,
    getProgramDetails,
    getProgramsByDept,
 } = require('../controllers/programController');

router.post('/', addProgram);
router.get('/admin/:admin_id', getProgramsByAdmin);
router.get('/:program_id/details', getProgramDetails);
router.get('/dept/:dept_id', getProgramsByDept);
//router.get('/by-dept/:deptId', getProgramsByDept);



module.exports = router;
