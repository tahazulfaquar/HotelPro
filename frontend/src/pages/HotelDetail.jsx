import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import RatingStars from '../components/RatingStars';
import {
  MapPin,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  Star,
  Bed,
  Maximize2,
  MessageSquare,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export default function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);

  // Booking date picker state
  const today = new Date();
  const defaultCheckIn = new Date(today);
  defaultCheckIn.setDate(today.getDate() + 1);
  const defaultCheckOut = new Date(today);
  defaultCheckOut.setDate(today.getDate() + 4);

  const [checkIn, setCheckIn] = useState(
    searchParams.get('checkIn') || defaultCheckIn.toISOString().split('T')[0]
  );
  const [checkOut, setCheckOut] = useState(
    searchParams.get('checkOut') || defaultCheckOut.toISOString().split('T')[0]
  );
  const [guests, setGuests] = useState(Number(searchParams.get('guests')) || 2);

  // Review submission state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Calculate stay nights
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const diff = new Date(checkOut) - new Date(checkIn);
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const nights = calculateNights();

  const fetchHotelData = async () => {
    try {
      const res = await api.get(`/hotels/${id}`);
      setHotel(res.data.hotel);
      setReviews(res.data.hotel.reviews || []);
    } catch (err) {
      console.error('Failed to load hotel:', err);
    }
  };

  const fetchRoomsAvailability = async () => {
    try {
      const res = await api.get(`/rooms/hotel/${id}`, {
        params: { checkIn, checkOut, guests },
      });
      setRooms(res.data.rooms || []);
    } catch (err) {
      console.error('Failed to check room availability:', err);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await fetchHotelData();
      await fetchRoomsAvailability();
      setLoading(false);
    };
    loadAll();
  }, [id]);

  useEffect(() => {
    if (checkIn && checkOut) {
      fetchRoomsAvailability();
    }
  }, [checkIn, checkOut, guests]);

  const handleBookRoom = (room) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnUrl: window.location.pathname } });
      return;
    }

    const params = new URLSearchParams({
      hotelId: hotel._id,
      roomId: room._id,
      checkIn,
      checkOut,
      guests,
    });

    navigate(`/checkout?${params.toString()}`);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await api.post('/reviews', {
        hotelId: hotel._id,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });

      setReviews([res.data.review, ...reviews]);
      setReviewComment('');
      setReviewTitle('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 4000);
      fetchHotelData(); // reload average score
    } catch (err) {
      console.error('Failed to post review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading || !hotel) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const galleryImages = hotel.images?.length > 0 ? hotel.images : [hotel.thumbnail];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      {/* Title & Location Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
              {hotel.starRating} Star Luxury Hotel
            </span>
            <RatingStars rating={hotel.averageRating} size="w-4 h-4" />
            <span className="text-xs text-slate-500 font-medium">
              ({hotel.numReviews} guest reviews)
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Starting from</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">${hotel.minPrice}</span>
              <span className="text-xs text-slate-500 font-medium">/ night</span>
            </div>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {hotel.name}
        </h1>
        <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
          <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{hotel.address}, {hotel.city}, {hotel.country}</span>
        </p>
      </div>

      {/* Photo Gallery Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
        <div className="lg:col-span-2 aspect-[16/10] rounded-3xl overflow-hidden shadow-sm bg-slate-100">
          <img
            src={galleryImages[activePhoto] || hotel.thumbnail}
            alt={hotel.name}
            className="w-full h-full object-cover transition-all duration-300"
          />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
          {galleryImages.slice(0, 3).map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActivePhoto(idx)}
              className={`aspect-[16/10] rounded-2xl overflow-hidden relative border-2 transition-all ${
                activePhoto === idx ? 'border-teal-600 ring-2 ring-teal-500/30' : 'border-transparent opacity-80 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Content & Reservation Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Description, Amenities, Policies */}
        <div className="lg:col-span-2 space-y-10">
          {/* Overview */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              Property Overview
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              {hotel.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" />
                <div>
                  <p className="font-bold text-slate-800">Check-In</p>
                  <p className="text-slate-500">From {hotel.checkInTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" />
                <div>
                  <p className="font-bold text-slate-800">Check-Out</p>
                  <p className="text-slate-500">Until {hotel.checkOutTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-600" />
                <div>
                  <p className="font-bold text-slate-800">Front Desk</p>
                  <p className="text-slate-500">{hotel.contactPhone}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Amenities */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Featured Amenities & Services
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {hotel.amenities?.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Available Rooms Section */}
          <section id="rooms-section" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Available Rooms & Suites
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Showing pricing for <span className="font-bold text-teal-700">{nights} {nights === 1 ? 'night' : 'nights'}</span> ({checkIn} to {checkOut})
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {rooms.map((room) => {
                const roomTotal = room.basePrice * nights;
                const isFree = room.isAvailable;

                return (
                  <div
                    key={room._id}
                    className={`bg-white rounded-3xl p-6 border transition-all ${
                      isFree
                        ? 'border-slate-200/90 shadow-sm hover:shadow-md'
                        : 'border-slate-200 bg-slate-50/70 opacity-75'
                    }`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                      {/* Room Photo */}
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
                        <img
                          src={room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80'}
                          alt={room.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Room Details */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[11px] font-bold">
                            {room.type}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">Room {room.roomNumber}</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">{room.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                          <span className="flex items-center gap-1">
                            <Bed className="w-3.5 h-3.5 text-teal-600" />
                            {room.bedType}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-teal-600" />
                            Up to {room.capacity?.adults} Adults
                          </span>
                          <span className="flex items-center gap-1">
                            <Maximize2 className="w-3.5 h-3.5 text-teal-600" />
                            {room.sizeSqFt} sq ft
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 pt-1">{room.description}</p>
                      </div>

                      {/* Price & Action */}
                      <div className="flex flex-col md:items-end justify-between border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                        <div className="md:text-right mb-4">
                          <div className="flex items-baseline gap-1 md:justify-end">
                            <span className="text-2xl font-black text-slate-900">${room.basePrice}</span>
                            <span className="text-xs text-slate-500">/ night</span>
                          </div>
                          <span className="text-xs font-semibold text-teal-700 block">
                            ${roomTotal} total for {nights} nights
                          </span>
                          <span className="text-[10px] text-slate-400 block">taxes included at checkout</span>
                        </div>

                        {isFree ? (
                          <button
                            onClick={() => handleBookRoom(room)}
                            className="w-full py-3 px-5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-1.5"
                          >
                            <span>Reserve This Room</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <div className="w-full py-2.5 px-4 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 text-center text-xs font-bold flex items-center justify-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Booked For Selected Dates</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Guest Reviews Section */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-teal-600" />
                  Verified Guest Reviews ({reviews.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Real feedback from genuine booked guests</p>
              </div>
              <RatingStars rating={hotel.averageRating} size="w-5 h-5" />
            </div>

            {/* Submit Review Box */}
            {isAuthenticated ? (
              <form onSubmit={handleSubmitReview} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider">Leave a Review</h4>
                {reviewSuccess && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200">
                    Thank you! Your verified review has been submitted.
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <label className="text-xs font-semibold text-slate-600">Your Rating:</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="text-xs font-bold p-1.5 bg-white border border-slate-300 rounded-lg cursor-pointer"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                    <option value={3}>⭐⭐⭐ (3 - Average)</option>
                    <option value={2}>⭐⭐ (2 - Below Expectations)</option>
                    <option value={1}>⭐ (1 - Poor)</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Review Headline (e.g., Amazing ocean views & friendly staff)"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
                <textarea
                  rows={3}
                  placeholder="Share details of your stay, cleanliness, hospitality, and comfort..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                ></textarea>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-teal-600 transition-colors shadow disabled:opacity-50"
                >
                  {submittingReview ? 'Posting...' : 'Post Guest Review'}
                </button>
              </form>
            ) : (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-600">
                <span>Want to leave a review? </span>
                <button onClick={() => navigate('/login')} className="font-bold text-teal-600 hover:underline">
                  Sign in to your guest account
                </button>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4 pt-2">
              {reviews.map((rev) => (
                <div key={rev._id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={rev.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                        alt={rev.user?.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span className="text-xs font-bold text-slate-900">{rev.user?.name || 'Verified Guest'}</span>
                    </div>
                    <RatingStars rating={rev.rating} size="w-3.5 h-3.5" />
                  </div>
                  {rev.title && <p className="text-xs font-bold text-slate-800">{rev.title}</p>}
                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sticky Reservation Configurator */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs text-slate-400 font-medium">Selected Period</span>
                <p className="text-lg font-black text-slate-900">{nights} Night Stay</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                Instant Confirmation
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Check-In Date</label>
                <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Check-Out Date</label>
                <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Total Guests</label>
                <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <Users className="w-4 h-4 text-teal-600 shrink-0" />
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value={1}>1 Adult</option>
                    <option value={2}>2 Adults</option>
                    <option value={3}>3 Adults</option>
                    <option value={4}>4 Adults</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2">
              <div className="flex items-center gap-2 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Zero reservation processing fee</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Free cancellation up to 48 hours</span>
              </div>
            </div>

            <a
              href="#rooms-section"
              className="w-full block text-center py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-lg shadow-teal-600/30 transition-all hover:scale-[1.02]"
            >
              Select Your Room Below
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
