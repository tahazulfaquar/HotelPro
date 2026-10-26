import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import {
  CalendarCheck,
  Building,
  Calendar,
  Clock,
  ArrowRight,
  AlertCircle,
  FileText,
  XCircle,
  Star,
  CheckCircle2,
} from 'lucide-react';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my-bookings');
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error('Failed to load guest bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleOpenCancel = (booking) => {
    setCancellingId(booking._id);
    setCancelReason('');
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancellingId) return;

    try {
      await api.put(`/bookings/${cancellingId}/cancel`, { reason: cancelReason });
      setActionMessage('Your reservation has been cancelled and refund processed.');
      setCancelModalOpen(false);
      setTimeout(() => setActionMessage(''), 5000);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return b.bookingStatus === 'confirmed';
    if (filter === 'active') return b.bookingStatus === 'checked-in';
    if (filter === 'completed') return b.bookingStatus === 'checked-out';
    if (filter === 'cancelled') return b.bookingStatus === 'cancelled';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
            Guest Portal
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-1">My Reservations</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your hotel stays, vouchers, and review completed trips
          </p>
        </div>

        <Link
          to="/hotels"
          className="px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <span>Find Another Hotel</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {actionMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {[
          { id: 'all', label: 'All Stays' },
          { id: 'upcoming', label: 'Upcoming Confirmed' },
          { id: 'active', label: 'Currently In-House' },
          { id: 'completed', label: 'Past Completed' },
          { id: 'cancelled', label: 'Cancelled' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              filter === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-44 bg-slate-200 animate-pulse rounded-3xl"></div>
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <CalendarCheck className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No reservations found</h3>
          <p className="text-xs text-slate-500 mb-6">
            You don't have any bookings matching this category. Start planning your next getaway!
          </p>
          <Link
            to="/hotels"
            className="px-6 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs shadow hover:bg-teal-700 transition-colors inline-block"
          >
            Explore Hotels
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const checkInFormatted = new Date(b.checkInDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
            const checkOutFormatted = new Date(b.checkOutDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={b._id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                  {/* Photo & Hotel info */}
                  <div className="flex items-center gap-4 md:col-span-2">
                    <img
                      src={b.hotel?.thumbnail || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80'}
                      alt={b.hotel?.name}
                      className="w-24 h-24 rounded-2xl object-cover shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {b.bookingCode}
                        </span>
                        {/* Status Badge */}
                        {b.bookingStatus === 'confirmed' && (
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                            Upcoming Confirmed
                          </span>
                        )}
                        {b.bookingStatus === 'checked-in' && (
                          <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                            Active In-House
                          </span>
                        )}
                        {b.bookingStatus === 'checked-out' && (
                          <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
                            Completed Stay
                          </span>
                        )}
                        {b.bookingStatus === 'cancelled' && (
                          <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
                            Cancelled (Refunded)
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900">{b.hotel?.name}</h3>
                      <p className="text-xs text-slate-500">{b.hotel?.city}, {b.hotel?.address}</p>
                      <p className="text-xs text-teal-700 font-semibold mt-1">
                        {b.room?.title} (Room #{b.room?.roomNumber})
                      </p>
                    </div>
                  </div>

                  {/* Dates & Financials */}
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-teal-600" />
                      <span>{checkInFormatted} — {checkOutFormatted}</span>
                    </div>
                    <p className="text-slate-500 font-medium">
                      Duration: <span className="text-slate-800 font-bold">{b.totalNights} Night(s)</span>
                    </p>
                    <p className="text-slate-500 font-medium">
                      Total Paid: <span className="text-slate-900 font-black text-sm">${b.totalPrice}</span>
                    </p>
                  </div>

                  {/* Action Controls */}
                  <div className="flex flex-col sm:flex-row md:flex-col gap-2 justify-end">
                    <Link
                      to={`/booking-confirmation/${b.bookingCode}`}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Voucher</span>
                    </Link>

                    {b.bookingStatus === 'confirmed' && (
                      <button
                        onClick={() => handleOpenCancel(b)}
                        className="px-4 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel Booking</span>
                      </button>
                    )}

                    {b.bookingStatus === 'checked-out' && (
                      <Link
                        to={`/hotels/${b.hotel?._id}#rooms-section`}
                        className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>Review Stay</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-slate-900">Cancel Reservation?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you wish to cancel this reservation? Per hotel policy, a full refund will be processed back to your original payment method.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reason for cancellation (optional):
              </label>
              <textarea
                rows={2}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="E.g., Travel plans changed, emergency..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              ></textarea>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Keep Reservation
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Yes, Cancel & Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
