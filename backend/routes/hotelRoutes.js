const express = require('express');
const router = express.Router();
const {
  getHotels,
  getFeaturedHotels,
  getDestinations,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  getMyHotels,
} = require('../controllers/hotelController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getHotels);
router.get('/featured', getFeaturedHotels);
router.get('/destinations', getDestinations);
router.get('/manager/my-hotels', protect, authorize('manager', 'admin'), getMyHotels);
router.get('/:id', getHotelById);

router.post('/', protect, authorize('manager', 'admin'), createHotel);
router.put('/:id', protect, authorize('manager', 'admin'), updateHotel);
router.delete('/:id', protect, authorize('admin'), deleteHotel);

module.exports = router;
