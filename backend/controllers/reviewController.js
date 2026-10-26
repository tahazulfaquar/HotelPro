const Review = require('../models/Review');
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');

// @desc    Add a review for a hotel
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const { hotelId, rating, title, comment, bookingId } = req.body;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }

    // Verify rating value
    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const review = await Review.create({
      user: req.user.id,
      hotel: hotelId,
      booking: bookingId || null,
      rating: numRating,
      title: title || '',
      comment,
    });

    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, { hasReviewed: true });
    }

    const populatedReview = await Review.findById(review._id).populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review: populatedReview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for a hotel
// @route   GET /api/reviews/hotel/:hotelId
// @access  Public
exports.getHotelReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ hotel: req.params.hotelId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Owner / Admin)
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (req.user.role !== 'admin' && review.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    const hotelId = review.hotel;
    await review.deleteOne();

    // Recalculate hotel rating
    const stats = await Review.aggregate([
      { $match: { hotel: hotelId } },
      {
        $group: {
          _id: '$hotel',
          averageRating: { $avg: '$rating' },
          numReviews: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      await Hotel.findByIdAndUpdate(hotelId, {
        averageRating: Math.round(stats[0].averageRating * 10) / 10,
        numReviews: stats[0].numReviews,
      });
    } else {
      await Hotel.findByIdAndUpdate(hotelId, { averageRating: 5.0, numReviews: 0 });
    }

    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};
