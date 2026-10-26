import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import {
  CheckCircle2,
  Calendar,
  Building,
  Printer,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';

export default function BookingSuccess() {
  const { code } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${code}`);
        setBooking(res.data.booking);
      } catch (err) {
        console.error('Failed to load confirmed booking:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto my-16 text-center p-8 bg-white rounded-3xl shadow">
        <p className="text-base font-bold text-slate-800">Booking reference not found.</p>
        <Link to="/" className="mt-4 inline-block text-xs font-bold text-teal-600">
          Return to Home
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const formattedCheckIn = new Date(booking.checkInDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedCheckOut = new Date(booking.checkOutDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex-1">
      {/* Top Success Banner */}
      <div className="no-print text-center mb-8">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-500/20">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
          Reservation Confirmed
        </span>
        <h1 className="text-3xl font-black text-slate-900 mt-1">
          You're All Set For Your Stay!
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          A confirmation copy has been registered under reference code{' '}
          <span className="font-bold text-teal-700">{booking.bookingCode}</span>.
        </p>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Voucher</span>
          </button>
          <Link
            to="/my-bookings"
            className="px-5 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs flex items-center gap-2 border border-teal-200 transition-colors"
          >
            <span>Go To My Bookings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Printable Voucher Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-10 space-y-8">
        {/* Voucher Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black text-xl shadow">
              HP
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">HotelPro Reservation Voucher</h2>
              <p className="text-xs text-slate-400">Official Guest Confirmation Document</p>
            </div>
          </div>

          <div className="text-left sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-2xl border sm:border-0 border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Booking Confirmation Code
            </span>
            <span className="text-2xl font-mono font-black text-teal-600 tracking-wider">
              {booking.bookingCode}
            </span>
            <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 sm:justify-end mt-0.5">
              <ShieldCheck className="w-3 h-3" />
              <span>Status: {booking.bookingStatus?.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Hotel & Stay Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Property Details
            </h3>
            <div>
              <h4 className="text-lg font-black text-slate-900">{booking.hotel?.name}</h4>
              <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>{booking.hotel?.address}, {booking.hotel?.city}, {booking.hotel?.country}</span>
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>{booking.hotel?.contactPhone || '+1 (800) 555-HOTEL'}</span>
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Guest Information
            </h3>
            <div>
              <h4 className="text-base font-bold text-slate-900">{booking.guestName}</h4>
              <p className="text-xs text-slate-600">{booking.guestEmail}</p>
              <p className="text-xs text-slate-500">{booking.guestPhone}</p>
              <p className="text-xs text-teal-700 font-semibold mt-1">
                Total Guests: {booking.totalGuests?.adults || 1} Adult(s)
              </p>
            </div>
          </div>
        </div>

        {/* Itinerary Schedule Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 font-bold uppercase block text-[10px]">Check-In</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{formattedCheckIn}</p>
            <p className="text-slate-500 text-[11px]">From {booking.hotel?.checkInTime || '15:00'}</p>
          </div>

          <div>
            <span className="text-slate-400 font-bold uppercase block text-[10px]">Check-Out</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{formattedCheckOut}</p>
            <p className="text-slate-500 text-[11px]">Until {booking.hotel?.checkOutTime || '11:00'}</p>
          </div>

          <div>
            <span className="text-slate-400 font-bold uppercase block text-[10px]">Room Allocated</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{booking.room?.title}</p>
            <p className="text-slate-500 text-[11px]">Room #{booking.room?.roomNumber} • {booking.totalNights} Nights</p>
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="pt-4 border-t border-slate-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Payment & Billing Summary
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Room Nightly Rate (${booking.pricePerNight} × {booking.totalNights} nights)</span>
              <span className="font-semibold text-slate-800">${booking.roomPrice}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Taxes & State Hospitality Surcharge (12%)</span>
              <span className="font-semibold text-slate-800">${booking.taxAmount}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Concierge & Housekeeping Fee</span>
              <span className="font-semibold text-slate-800">${booking.serviceFee}</span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
              <span>Total Paid</span>
              <span className="text-teal-700">${booking.totalPrice}</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
            <span>Payment Method: {booking.paymentMethod}</span>
            <span className="font-mono text-slate-400">Trans ID: {booking.paymentId}</span>
          </div>
        </div>

        {/* Policies Footer */}
        <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-100 text-[11px] text-teal-900 leading-relaxed">
          <p className="font-bold mb-0.5">Check-In Instructions:</p>
          Please present a valid government-issued photo ID upon arrival at the hotel front desk. Complimentary luggage storage is available before check-in and after check-out.
        </div>
      </div>
    </div>
  );
}
