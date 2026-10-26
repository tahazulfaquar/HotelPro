const express = require('express');
const router = express.Router();
const {
  getRoomsByHotel,
  getRoomById,
  createRoom,
  updateRoom,
  updateRoomStatus,
  deleteRoom,
} = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/auth');

router.get('/hotel/:hotelId', getRoomsByHotel);
router.get('/:id', getRoomById);

router.post('/', protect, authorize('manager', 'admin'), createRoom);
router.put('/:id', protect, authorize('manager', 'admin'), updateRoom);
router.patch('/:id/status', protect, authorize('manager', 'admin'), updateRoomStatus);
router.delete('/:id', protect, authorize('manager', 'admin'), deleteRoom);

module.exports = router;
