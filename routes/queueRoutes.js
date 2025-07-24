const express = require('express');
const router = express.Router();
const {
  createQueueEntry,
  getNextInQueue,
  deferQueueEntry,
  assignAgentToClient,
  getQueueByStatus,
  reassignClientToAgent,
  getAllQueue
} = require('../controllers/queueController');

// 1. POST /queue – לקוחות יכולים להרשם לתור
router.post('/', createQueueEntry);

// 2. GET /next/queue – שליפת הלקוח הבא בתור
router.get('/next/queue', getNextInQueue);

// 3. POST /defer/:id – דחיית לקוח לסוף התור
router.post('/defer/:id', deferQueueEntry);

// 4. POST /agentId/:agentId/assign/id/:id – שיוך לקוח לסוכן
router.post('/agentId/:agentId/assign/id/:id', assignAgentToClient);

// 5. GET /by-status?status=pending – שליפת תור לפי סטטוס
router.get('/by-status', getQueueByStatus);

// 6. POST /queue/:id/assign/:agentId – שיוך מחדש ללקוח שטופל
router.post('/:id/assign/:agentId', reassignClientToAgent);

// עזר – כל התור
router.get('/all', getAllQueue);

module.exports = router;
