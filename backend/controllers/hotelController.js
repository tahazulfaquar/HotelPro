const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const Review = require('../models/Review');

// @desc    Get all hotels with filters & search
// @route   GET /api/hotels
// @access  Public
exports.getHotels = async (req, res, next) => {
  try {
    const { city, search, starRating, minPrice, maxPrice, amenities, sort, page = 1, limit = 12 } = req.query;

    const query = {};

    if (city && city.trim() !== '' && city !== 'All') {
      query.city = { $regex: new RegExp(`^${city.trim()}$`, 'i') };
    }

    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (starRating) {
      const stars = Array.isArray(starRating) ? starRating.map(Number) : [Number(starRating)];
      query.starRating = { $in: stars };
    }

    if (amenities) {
      const amenitiesList = Array.isArray(amenities) ? amenities : amenities.split(',');
      query.amenities = { $all: amenitiesList };
    }

    // Determine sort
    let sortOptions = { averageRating: -1 };
    if (sort === 'rating_desc') sortOptions = { averageRating: -1 };
    if (sort === 'rating_asc') sortOptions = { averageRating: 1 };
    if (sort === 'name_asc') sortOptions = { name: 1 };
    if (sort === 'newest') sortOptions = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Hotel.countDocuments(query);
    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit))
      .populate('manager', 'name email');

    // Attach minimum room price per night to each hotel
    const hotelsWithPricing = await Promise.all(
      hotels.map(async (hotel) => {
        const rooms = await Room.find({ hotel: hotel._id, isActive: true }).select('basePrice');
        const minRoomPrice = rooms.length > 0 ? Math.min(...rooms.map((r) => r.basePrice)) : 120;
        const hotelObj = hotel.toObject();
        hotelObj.minPrice = minRoomPrice;
        hotelObj.availableRoomsCount = rooms.length;
        return hotelObj;
      })
    );

    // Apply minPrice/maxPrice filter if requested
    let filteredHotels = hotelsWithPricing;
    if (minPrice || maxPrice) {
      const min = Number(minPrice) || 0;
      const max = Number(maxPrice) || Infinity;
      filteredHotels = filteredHotels.filter((h) => h.minPrice >= min && h.minPrice <= max);
    }

    if (sort === 'price_asc') {
      filteredHotels.sort((a, b) => a.minPrice - b.minPrice);
    } else if (sort === 'price_desc') {
      filteredHotels.sort((a, b) => b.minPrice - a.minPrice);
    }

    res.json({
      success: true,
      count: filteredHotels.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      hotels: filteredHotels,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured hotels for landing page
// @route   GET /api/hotels/featured
// @access  Public
exports.getFeaturedHotels = async (req, res, next) => {
  try {
    const hotels = await Hotel.find({ featured: true }).limit(6);
    const hotelsWithPricing = await Promise.all(
      hotels.map(async (hotel) => {
        const rooms = await Room.find({ hotel: hotel._id, isActive: true }).select('basePrice');
        const minRoomPrice = rooms.length > 0 ? Math.min(...rooms.map((r) => r.basePrice)) : 149;
        const hotelObj = hotel.toObject();
        hotelObj.minPrice = minRoomPrice;
        return hotelObj;
      })
    );

    res.json({
      success: true,
      hotels: hotelsWithPricing,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get popular destinations with count
// @route   GET /api/hotels/destinations
// @access  Public
exports.getDestinations = async (req, res, next) => {
  try {
    const destinations = await Hotel.aggregate([
      {
        $group: {
          _id: '$city',
          count: { $sum: 1 },
          image: { $first: '$thumbnail' },
          country: { $first: '$country' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    const formatted = destinations.map((d) => ({
      city: d._id,
      count: d.count,
      country: d.country,
      image: d.image,
    }));

    res.json({
      success: true,
      destinations: formatted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single hotel by ID with rooms & reviews
// @route   GET /api/hotels/:id
// @access  Public
exports.getHotelById = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate('manager', 'name email phone');

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      });
    }

    const rooms = await Room.find({ hotel: hotel._id, isActive: true }).sort({ basePrice: 1 });
    const reviews = await Review.find({ hotel: hotel._id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    const minPrice = rooms.length > 0 ? Math.min(...rooms.map((r) => r.basePrice)) : 120;

    res.json({
      success: true,
      hotel: {
        ...hotel.toObject(),
        minPrice,
        rooms,
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new hotel
// @route   POST /api/hotels
// @access  Private (Manager / Admin)
exports.createHotel = async (req, res, next) => {
  try {
    const hotelData = {
      ...req.body,
      manager: req.user.role === 'admin' && req.body.manager ? req.body.manager : req.user.id,
    };

    const hotel = await Hotel.create(hotelData);

    res.status(201).json({
      success: true,
      message: 'Hotel created successfully',
      hotel,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update hotel
// @route   PUT /api/hotels/:id
// @access  Private (Manager / Admin)
exports.updateHotel = async (req, res, next) => {
  try {
    let hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }

    // Verify ownership if manager
    if (req.user.role === 'manager' && hotel.manager.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this hotel',
      });
    }

    hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Hotel updated successfully',
      hotel,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Private (Admin only)
exports.deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }

    await Room.deleteMany({ hotel: hotel._id });
    await Review.deleteMany({ hotel: hotel._id });
    await hotel.deleteOne();

    res.json({
      success: true,
      message: 'Hotel and associated rooms removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get hotels managed by logged-in manager
// @route   GET /api/hotels/manager/my-hotels
// @access  Private (Manager / Admin)
exports.getMyHotels = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { manager: req.user.id };
    const hotels = await Hotel.find(query).sort({ createdAt: -1 });

    const hotelsWithStats = await Promise.all(
      hotels.map(async (hotel) => {
        const totalRooms = await Room.countDocuments({ hotel: hotel._id });
        const activeRooms = await Room.countDocuments({ hotel: hotel._id, status: 'available' });
        const hotelObj = hotel.toObject();
        hotelObj.totalRooms = totalRooms;
        hotelObj.availableRooms = activeRooms;
        return hotelObj;
      })
    );

    res.json({
      success: true,
      hotels: hotelsWithStats,
    });
  } catch (error) {
    next(error);
  }
};
