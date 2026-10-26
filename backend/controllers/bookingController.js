const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Hotel = require('../models/Hotel');
const { isRoomBooked } = require('./roomController');

// @desc    Create a new booking with conflict check
// @route   POST /api/bookings
// @access  Private (Guest / Any authenticated)
exports.createBooking = async (req, res, next) => {
  try {
    const {
      hotelId,
      roomId,
      checkInDate,
      checkOutDate,
      adults = 1,
      children = 0,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests,
      paymentMethod = 'card_simulation',
    } = req.body;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid check-in or check-out date' });
    }

    if (checkOut <= checkIn) {
      return res.status(400).json({ success: false, message: 'Check-out date must be after check-in date' });
    }

    const room = await Room.findById(roomId);
    if (!room || !room.isActive) {
      return res.status(404).json({ success: false, message: 'Room not found or no longer available' });
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }

    // Capacity verification
    if (Number(adults) > room.capacity.adults + 1) {
      return res.status(400).json({
        success: false,
        message: `This room accommodates up to ${room.capacity.adults} adults.`,
      });
    }

    // Overlapping booking verification
    const booked = await isRoomBooked(roomId, checkIn, checkOut);
    if (booked) {
      return res.status(409).json({
        success: false,
        message: 'This room is already booked for the selected dates. Please choose different dates or another room.',
      });
    }

    // Calculate nights & pricing
    const diffTime = Math.abs(checkOut - checkIn);
    const totalNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const pricePerNight = room.basePrice;
    const roomPrice = pricePerNight * totalNights;
    const taxAmount = Math.round(roomPrice * 0.12 * 100) / 100; // 12% standard hotel tax
    const serviceFee = 25; // standard booking service charge
    const totalPrice = Math.round((roomPrice + taxAmount + serviceFee) * 100) / 100;

    // Generate unique booking confirmation code
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const bookingCode = `HP-${randomNum}`;

    const booking = await Booking.create({
      bookingCode,
      user: req.user.id,
      hotel: hotelId,
      room: roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalNights,
      totalGuests: { adults: Number(adults), children: Number(children) },
      guestName: guestName || req.user.name,
      guestEmail: guestEmail || req.user.email,
      guestPhone: guestPhone || req.user.phone || '',
      specialRequests: specialRequests || '',
      pricePerNight,
      roomPrice,
      taxAmount,
      serviceFee,
      totalPrice,
      paymentStatus: 'paid',
      paymentMethod,
      paymentId: `PAY-${Date.now()}-${randomNum}`,
      bookingStatus: 'confirmed',
    });

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's personal bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('hotel', 'name thumbnail address city starRating contactPhone')
      .populate('room', 'roomNumber type title bedType images')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID or Code (Voucher/Invoice)
// @route   GET /api/bookings/:idOrCode
// @access  Private
exports.getBookingDetails = async (req, res, next) => {
  try {
    const param = req.params.idOrCode;
    const query = param.startsWith('HP-') ? { bookingCode: param } : { _id: param };

    const booking = await Booking.findOne(query)
      .populate('hotel')
      .populate('room')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Access check: User owns it, or is Manager/Admin
    if (
      req.user.role === 'guest' &&
      booking.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (req.user.role === 'guest' && booking.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    if (booking.bookingStatus === 'checked-out') {
      return res.status(400).json({ success: false, message: 'Cannot cancel a completed stay' });
    }

    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';
    booking.cancellationReason = reason || 'Cancelled by user';
    booking.cancelledAt = new Date();
    await booking.save();

    // Release room if occupied
    await Room.findByIdAndUpdate(booking.room, { status: 'available' });

    res.json({
      success: true,
      message: 'Booking has been cancelled and refund processed',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings for Manager's properties
// @route   GET /api/bookings/manager/all
// @access  Private (Manager / Admin)
exports.getManagerBookings = async (req, res, next) => {
  try {
    const { hotelId, status, date } = req.query;

    let hotelIds = [];
    if (req.user.role === 'admin') {
      if (hotelId) hotelIds = [hotelId];
    } else {
      const myHotels = await Hotel.find({ manager: req.user.id }).select('_id');
      hotelIds = myHotels.map((h) => h._id);
      if (hotelId && hotelIds.map(String).includes(hotelId)) {
        hotelIds = [hotelId];
      }
    }

    const query = { hotel: { $in: hotelIds } };

    if (status && status !== 'all') {
      query.bookingStatus = status;
    }

    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      query.checkInDate = { $gte: targetDate, $lt: nextDay };
    }

    const bookings = await Booking.find(query)
      .populate('hotel', 'name city thumbnail')
      .populate('room', 'roomNumber type title')
      .populate('user', 'name email phone avatar')
      .sort({ checkInDate: 1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking lifecycle (Check-in, Check-out, etc.)
// @route   PATCH /api/bookings/:id/status
// @access  Private (Manager / Admin)
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['confirmed', 'checked-in', 'checked-out', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid booking status' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.bookingStatus = status;

    // Automatic Room PMS status synchronization:
    if (status === 'checked-in') {
      await Room.findByIdAndUpdate(booking.room, { status: 'occupied' });
    } else if (status === 'checked-out') {
      // Room moves to cleaning before available again
      await Room.findByIdAndUpdate(booking.room, { status: 'cleaning' });
    } else if (status === 'cancelled') {
      await Room.findByIdAndUpdate(booking.room, { status: 'available' });
      booking.paymentStatus = 'refunded';
    }

    await booking.save();

    res.json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: get all platform bookings
// @route   GET /api/bookings/admin/all
// @access  Private (Admin only)
exports.getAllBookingsAdmin = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await Booking.countDocuments();
    const bookings = await Booking.find()
      .populate('hotel', 'name city')
      .populate('room', 'roomNumber type')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      bookings,
    });
  } catch (error) {
    next(error);
  }
};
