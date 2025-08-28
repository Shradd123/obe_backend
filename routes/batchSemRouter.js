// // routes/batchSemRouter.js
// const express = require('express');
// const router = express.Router();
// const {
//     getBatchSems,
//     assignSem,
// //   getAllBatchSem,
// //   addBatchSem,
//   deleteBatchSem,
// } = require('../controllers/batchSemController');

// // router.get('/', getAllBatchSem);       // GET all mappings
// // router.post('/', addBatchSem);  
// // 
//        router.get("/", getBatchSems);
// router.post("/", assignSem);
// router.delete('/:id', deleteBatchSem); // Delete by ID

// module.exports = router;



const express = require('express');
const router = express.Router();
const {
  getBatchSems,
  assignSem,
  deleteBatchSem,
} = require('../controllers/batchSemController');

// Get all batch_sem mappings
router.get("/", getBatchSems);

// Assign semester to batch
router.post("/", assignSem);

// Delete batch_sem by ID
router.delete("/:id", deleteBatchSem);


const { getSemestersByBatch } = require('../controllers/batchSemController');

// GET /batch-sem/:batchId — list sems available for a batch
router.get('/:batchId', getSemestersByBatch);

module.exports = router;
