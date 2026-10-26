const express = require('express');
const router = express.Router();
const {
  getManagerDashboard,
  getAdminDashboard,
  getRoomCalendarMatrix,
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.get('/manager', protect, authorize('manager', 'admin'), getManagerDashboard);
router.get('/admin', protect, authorize('admin'), getAdminDashboard);
router.get('/calendar', protect, authorize('manager', 'admin'), getRoomCalendarMatrix);

module.exports = router;
