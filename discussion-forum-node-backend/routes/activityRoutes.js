const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, adminOnly, activityController.getActivityLogs);
router.post('/', activityController.logActivity);

module.exports = router;
