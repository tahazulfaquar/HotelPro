import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  CreditCard,
  Building,
  Calendar,
  Users,
  ShieldCheck,
  Lock,
  ArrowRight,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const hotelId = searchParams.get('hotelId');
  const roomId = searchParams.get('roomId');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = searchParams.get('guests') || 2;

  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Guest details form
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState(user?.phone || '+1 (555) 482-1920');
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card_simulation');

  // Simulated card form
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Calculate nights
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const diff = new Date(checkOut) - new Date(checkIn);
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const nights = calculateNights();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotelRes, roomRes] = await Promise.all([
          api.get(`/hotels/${hotelId}`),
          api.get(`/rooms/${roomId}`),
        ]);
        setHotel(hotelRes.data.hotel);
        setRoom(roomRes.data.room);
      } catch (err) {
        console.error('Error fetching checkout details:', err);
        setErrorMessage('Failed to load reservation details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (hotelId && roomId) {
      fetchData();
    }
  }, [hotelId, roomId]);

  if (loading || !hotel || !room) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const roomSubtotal = room.basePrice * nights;
  const taxAmount = Math.round(roomSubtotal * 0.12 * 100) / 100;
  const serviceFee = 25;
  const grandTotal = Math.round((roomSubtotal + taxAmount + serviceFee) * 100) / 100;

  const handleConfirmReservation = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        hotelId: hotel._id,
        roomId: room._id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        adults: Number(guests),
        guestName,
        guestEmail,
        guestPhone,
        specialRequests,
        paymentMethod,
      };

      const res = await api.post('/bookings', payload);
      const booking = res.data.booking;
      navigate(`/booking-confirmation/${booking.bookingCode}`);
    } catch (err) {
      console.error('Booking failed:', err);
      setErrorMessage(
        err.response?.data?.message || 'Booking submission encountered an error. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
      <div className="max-w-4xl mx-auto mb-8 text-center sm:text-left">
        <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
          Secure Reservation Process
        </span>
        <h1 className="text-3xl font-black text-slate-900 mt-1">
          Review & Complete Your Booking
        </h1>
      </div>

      {errorMessage && (
        <div className="max-w-4xl mx-auto mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {/* Left Form: Guest Info & Payment */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleConfirmReservation} className="space-y-6">
            {/* Guest Details Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-600" />
                Primary Guest Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full text-xs font-semibold p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Email Confirmation</label>
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full text-xs font-semibold p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full text-xs font-semibold p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="E.g., early check-in, high floor, quiet room, late departure..."
                    className="w-full text-xs font-semibold p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-teal-600" />
                  Payment Details
                </h3>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Lock className="w-3 h-3" />
                  256-bit Encrypted
                </span>
              </div>

              {/* Payment Type Selection */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card_simulation')}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                    paymentMethod === 'card_simulation'
                      ? 'border-teal-500 bg-teal-50/50 text-teal-900 ring-2 ring-teal-500/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>Credit / Debit Card</span>
                  <CreditCard className="w-4 h-4 text-teal-600" />
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash_at_frontdesk')}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                    paymentMethod === 'cash_at_frontdesk'
                      ? 'border-teal-500 bg-teal-50/50 text-teal-900 ring-2 ring-teal-500/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>Pay At Front Desk</span>
                  <Building className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {paymentMethod === 'card_simulation' && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Card Number</label>
                    <input
                      type="text"
                      readOnly
                      value={cardNumber}
                      className="w-full text-xs font-mono font-bold p-3 bg-slate-100 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Expiry</label>
                      <input
                        type="text"
                        readOnly
                        value={cardExpiry}
                        className="w-full text-xs font-mono font-bold p-3 bg-slate-100 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">CVC</label>
                      <input
                        type="text"
                        readOnly
                        value={cardCvc}
                        className="w-full text-xs font-mono font-bold p-3 bg-slate-100 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-teal-700 bg-teal-50 p-2.5 rounded-xl border border-teal-200">
                    ℹ️ Test payment simulation is primed. Clicking 'Confirm & Pay' will immediately generate your reservation.
                  </p>
                </div>
              )}

              {paymentMethod === 'cash_at_frontdesk' && (
                <div className="p-3 bg-amber-50 text-amber-900 rounded-xl text-xs border border-amber-200">
                  Your reservation is held instantly. You will pay ${grandTotal} upon arrival during front-desk check-in.
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm shadow-xl shadow-teal-600/30 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{submitting ? 'Confirming Reservation...' : `Confirm & Pay $${grandTotal}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Itinerary Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-5 sticky top-24">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Reservation Summary
            </h3>

            {/* Hotel mini summary */}
            <div className="flex gap-3">
              <img
                src={hotel.thumbnail}
                alt={hotel.name}
                className="w-16 h-16 rounded-2xl object-cover shrink-0"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">{hotel.name}</h4>
                <p className="text-xs text-slate-500">{hotel.city}, {hotel.country}</p>
                <span className="inline-block mt-1 text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  {hotel.starRating} Stars
                </span>
              </div>
            </div>

            {/* Room details */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
              <p className="text-xs font-bold text-slate-800">{room.title}</p>
              <p className="text-[11px] text-slate-500">Room #{room.roomNumber} • {room.bedType}</p>
              <p className="text-[11px] text-slate-500">Occupancy: {guests} Guest(s)</p>
            </div>

            {/* Dates */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Check-In:</span>
                <span className="font-bold text-slate-800">{checkIn} (from {hotel.checkInTime})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Check-Out:</span>
                <span className="font-bold text-slate-800">{checkOut} (until {hotel.checkOutTime})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Length of stay:</span>
                <span className="font-bold text-teal-700">{nights} Night(s)</span>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="space-y-2 text-xs pt-2">
              <div className="flex justify-between text-slate-600">
                <span>${room.basePrice} × {nights} nights</span>
                <span className="font-semibold text-slate-800">${roomSubtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Hospitality taxes (12%)</span>
                <span className="font-semibold text-slate-800">${taxAmount}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Service & concierge fee</span>
                <span className="font-semibold text-slate-800">${serviceFee}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-3 border-t border-slate-200">
                <span>Total Due</span>
                <span className="text-teal-700">${grandTotal}</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Full refund guarantee up to 48h prior</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
