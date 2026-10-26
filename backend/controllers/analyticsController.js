const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Hotel = require('../models/Hotel');
const User = require('../models/User');

// @desc    Get dashboard metrics for hotel manager
// @route   GET /api/analytics/manager
// @access  Private (Manager / Admin)
exports.getManagerDashboard = async (req, res, next) => {
  try {
    const { hotelId } = req.query;

    let targetHotelIds = [];
    if (req.user.role === 'admin') {
      if (hotelId) {
        targetHotelIds = [hotelId];
      } else {
        const allHotels = await Hotel.find().select('_id');
        targetHotelIds = allHotels.map((h) => h._id);
      }
    } else {
      const myHotels = await Hotel.find({ manager: req.user.id }).select('_id');
      targetHotelIds = myHotels.map((h) => h._id);
      if (hotelId && targetHotelIds.map(String).includes(hotelId)) {
        targetHotelIds = [hotelId];
      }
    }

    // 1. Total rooms and housekeeping stats
    const rooms = await Room.find({ hotel: { $in: targetHotelIds }, isActive: true });
    const totalRooms = rooms.length;
    const roomStatusCounts = {
      available: rooms.filter((r) => r.status === 'available').length,
      occupied: rooms.filter((r) => r.status === 'occupied').length,
      cleaning: rooms.filter((r) => r.status === 'cleaning').length,
      maintenance: rooms.filter((r) => r.status === 'maintenance').length,
    };

    // 2. Bookings stats
    const allBookings = await Booking.find({ hotel: { $in: targetHotelIds } });
    const confirmedBookings = allBookings.filter((b) => b.bookingStatus !== 'cancelled');

    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const totalNightsSold = confirmedBookings.reduce((sum, b) => sum + (b.totalNights || 0), 0);

    // Occupancy Rate: (occupied rooms / total rooms) * 100
    const occupancyRate = totalRooms > 0 ? Math.round((roomStatusCounts.occupied / totalRooms) * 100) : 0;

    // Average Daily Rate (ADR): total revenue / total nights
    const adr = totalNightsSold > 0 ? Math.round(totalRevenue / totalNightsSold) : 0;

    // Today's arrivals and departures
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayCheckIns = allBookings.filter(
      (b) =>
        b.bookingStatus === 'confirmed' &&
        new Date(b.checkInDate) >= today &&
        new Date(b.checkInDate) < tomorrow
    ).length;

    const todayCheckOuts = allBookings.filter(
      (b) =>
        b.bookingStatus === 'checked-in' &&
        new Date(b.checkOutDate) >= today &&
        new Date(b.checkOutDate) < tomorrow
    ).length;

    // Monthly revenue trend (last 6 months)
    const monthlyRevenue = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mYear = d.getFullYear();
      const mMonth = d.getMonth();

      const revenueThisMonth = confirmedBookings
        .filter((b) => {
          const bDate = new Date(b.createdAt);
          return bDate.getFullYear() === mYear && bDate.getMonth() === mMonth;
        })
        .reduce((sum, b) => sum + b.totalPrice, 0);

      monthlyRevenue.push({
        month: monthNames[mMonth],
        year: mYear,
        revenue: Math.round(revenueThisMonth),
      });
    }

    // Recent 5 bookings
    const recentBookings = await Booking.find({ hotel: { $in: targetHotelIds } })
      .populate('hotel', 'name')
      .populate('room', 'roomNumber type')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      data: {
        totalRevenue: Math.round(totalRevenue),
        totalBookings: confirmedBookings.length,
        occupancyRate,
        adr,
        totalRooms,
        roomStatusCounts,
        todayCheckIns,
        todayCheckOuts,
        monthlyRevenue,
        recentBookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Admin global platform stats
// @route   GET /api/analytics/admin
// @access  Private (Admin only)
exports.getAdminDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalGuests = await User.countDocuments({ role: 'guest' });
    const totalManagers = await User.countDocuments({ role: 'manager' });
    const totalHotels = await Hotel.countDocuments();
    const totalRooms = await Room.countDocuments({ isActive: true });
    const totalBookings = await Booking.countDocuments();

    const bookings = await Booking.find({ bookingStatus: { $ne: 'cancelled' } });
    const platformGrossRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    // Platform fee (e.g., 10% commission)
    const platformCommission = Math.round(platformGrossRevenue * 0.1);

    const popularHotels = await Booking.aggregate([
      { $match: { bookingStatus: { $ne: 'cancelled' } } },
      { $group: { _id: '$hotel', bookingsCount: { $sum: 1 }, totalEarned: { $sum: '$totalPrice' } } },
      { $sort: { bookingsCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'hotels',
          localField: '_id',
          foreignField: '_id',
          as: 'hotelInfo',
        },
      },
      { $unwind: '$hotelInfo' },
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalGuests,
        totalManagers,
        totalHotels,
        totalRooms,
        totalBookings,
        platformGrossRevenue: Math.round(platformGrossRevenue),
        platformCommission,
        popularHotels: popularHotels.map((h) => ({
          hotelId: h._id,
          name: h.hotelInfo.name,
          city: h.hotelInfo.city,
          bookingsCount: h.bookingsCount,
          totalEarned: Math.round(h.totalEarned),
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get room calendar matrix for property management
// @route   GET /api/analytics/calendar
// @access  Private (Manager / Admin)
exports.getRoomCalendarMatrix = async (req, res, next) => {
  try {
    const { hotelId, month, year } = req.query;

    if (!hotelId) {
      return res.status(400).json({ success: false, message: 'hotelId parameter is required' });
    }

    const currentYear = year ? Number(year) : new Date().getFullYear();
    const currentMonth = month !== undefined ? Number(month) : new Date().getMonth();

    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

    const rooms = await Room.find({ hotel: hotelId, isActive: true }).sort({ roomNumber: 1 });

    const bookings = await Booking.find({
      hotel: hotelId,
      bookingStatus: { $in: ['confirmed', 'checked-in'] },
      checkInDate: { $lte: endDate },
      checkOutDate: { $gte: startDate },
    }).populate('user', 'name');

    res.json({
      success: true,
      month: currentMonth,
      year: currentYear,
      daysInMonth: endDate.getDate(),
      rooms,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};
