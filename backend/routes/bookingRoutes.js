const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingDetails,
  cancelBooking,
  getManagerBookings,
  updateBookingStatus,
  getAllBookingsAdmin,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/manager/all', protect, authorize('manager', 'admin'), getManagerBookings);
router.get('/admin/all', protect, authorize('admin'), getAllBookingsAdmin);
router.get('/:idOrCode', protect, getBookingDetails);
router.put('/:id/cancel', protect, cancelBooking);
router.patch('/:id/status', protect, authorize('manager', 'admin'), updateBookingStatus);

module.exports = router;
