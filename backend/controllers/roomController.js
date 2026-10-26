const Room = require('../models/Room');
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');

// Helper: Check if room is booked during date range
const isRoomBooked = async (roomId, checkIn, checkOut, excludeBookingId = null) => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  const query = {
    room: roomId,
    bookingStatus: { $in: ['confirmed', 'checked-in'] },
    // Standard interval overlap condition:
    // (existingCheckIn < requestedCheckOut) AND (existingCheckOut > requestedCheckIn)
    checkInDate: { $lt: checkOutDate },
    checkOutDate: { $gt: checkInDate },
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflictingBooking = await Booking.findOne(query);
  return !!conflictingBooking;
};

// @desc    Get all rooms for a hotel with date availability flag
// @route   GET /api/rooms/hotel/:hotelId
// @access  Public
exports.getRoomsByHotel = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    const { checkIn, checkOut, guests } = req.query;

    const query = { hotel: hotelId, isActive: true };

    if (guests) {
      query['capacity.adults'] = { $gte: Number(guests) };
    }

    const rooms = await Room.find(query).sort({ basePrice: 1 });

    let roomsWithAvailability = rooms.map((room) => room.toObject());

    if (checkIn && checkOut) {
      roomsWithAvailability = await Promise.all(
        roomsWithAvailability.map(async (room) => {
          const booked = await isRoomBooked(room._id, checkIn, checkOut);
          return {
            ...room,
            isAvailable: !booked && room.status === 'available',
            bookingConflict: booked,
          };
        })
      );
    } else {
      roomsWithAvailability = roomsWithAvailability.map((r) => ({
        ...r,
        isAvailable: r.status === 'available',
      }));
    }

    res.json({
      success: true,
      count: roomsWithAvailability.length,
      rooms: roomsWithAvailability,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public
exports.getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate('hotel', 'name address city starRating');
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    res.json({ success: true, room });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new room
// @route   POST /api/rooms
// @access  Private (Manager / Admin)
exports.createRoom = async (req, res, next) => {
  try {
    const { hotel: hotelId, roomNumber } = req.body;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Associated hotel not found' });
    }

    if (req.user.role === 'manager' && hotel.manager.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You do not manage this hotel' });
    }

    const existing = await Room.findOne({ hotel: hotelId, roomNumber });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Room number ${roomNumber} already exists in this hotel`,
      });
    }

    const room = await Room.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update room details
// @route   PUT /api/rooms/:id
// @access  Private (Manager / Admin)
exports.updateRoom = async (req, res, next) => {
  try {
    let room = await Room.findById(req.params.id).populate('hotel');
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    if (req.user.role === 'manager' && room.hotel.manager.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this room' });
    }

    room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Room updated successfully',
      room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Quick toggle room status (Housekeeping / Maintenance)
// @route   PATCH /api/rooms/:id/status
// @access  Private (Manager / Admin)
exports.updateRoomStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['available', 'occupied', 'cleaning', 'maintenance'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid room status' });
    }

    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    room.status = status;
    await room.save();

    res.json({
      success: true,
      message: `Room status updated to ${status}`,
      room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete room (soft delete isActive=false)
// @route   DELETE /api/rooms/:id
// @access  Private (Manager / Admin)
exports.deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    room.isActive = false;
    await room.save();

    res.json({
      success: true,
      message: 'Room deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};

exports.isRoomBooked = isRoomBooked;
