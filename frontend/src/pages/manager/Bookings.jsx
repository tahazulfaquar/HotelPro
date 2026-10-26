import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import {
  Search,
  CheckCircle2,
  LogOut,
  XCircle,
  Calendar,
  Building,
  User,
  Phone,
  Mail,
  AlertCircle,
  Clock,
  Filter,
} from 'lucide-react';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchHotels = async () => {
    try {
      const res = await api.get('/hotels/manager/my-hotels');
      setHotels(res.data.hotels || []);
    } catch (err) {
      console.error('Error fetching manager hotels:', err);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedHotel) params.hotelId = selectedHotel;
      if (statusFilter && statusFilter !== 'all') params.status = statusFilter;

      const res = await api.get('/bookings/manager/all', { params });
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error('Error fetching manager bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [selectedHotel, statusFilter]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status: newStatus });
      setActionSuccess(`Booking updated to ${newStatus} successfully!`);
      setTimeout(() => setActionSuccess(''), 4000);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update booking status');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.bookingCode?.toLowerCase().includes(q) ||
      b.guestName?.toLowerCase().includes(q) ||
      b.guestEmail?.toLowerCase().includes(q) ||
      b.room?.roomNumber?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
            Front-Desk Command Center
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-1">
            Reservations & Check-In Desk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Process arrivals, departures, walk-in status synchronization, and guest manifests
          </p>
        </div>

        {/* Hotel Filter */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 flex items-center gap-2 shadow-sm self-start sm:self-auto">
          <Building className="w-4 h-4 text-teal-600 ml-1" />
          <select
            value={selectedHotel}
            onChange={(e) => setSelectedHotel(e.target.value)}
            className="text-xs font-bold bg-transparent text-slate-800 focus:outline-none cursor-pointer pr-4"
          >
            <option value="">All Managed Hotels</option>
            {hotels.map((h) => (
              <option key={h._id} value={h._id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Search & Status Filters */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by guest name, email, booking code (HP-...), or room number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-teal-600 shrink-0 ml-1" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Reservation Statuses</option>
              <option value="confirmed">Upcoming Confirmed</option>
              <option value="checked-in">Currently In-House (Checked-In)</option>
              <option value="checked-out">Completed (Checked-Out)</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs font-medium">
            No reservations found matching the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Booking Ref</th>
                  <th className="py-3.5 px-4">Guest Details</th>
                  <th className="py-3.5 px-4">Hotel & Room</th>
                  <th className="py-3.5 px-4">Dates</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Current Status</th>
                  <th className="py-3.5 px-4 text-right">Front Desk Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-teal-600">
                      {b.bookingCode}
                    </td>

                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-900">{b.guestName}</p>
                      <p className="text-[11px] text-slate-500">{b.guestEmail}</p>
                      <p className="text-[11px] text-slate-400">{b.guestPhone}</p>
                    </td>

                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-800">{b.hotel?.name}</p>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-slate-100 text-[10px] font-semibold text-slate-700">
                        Room #{b.room?.roomNumber} • {b.room?.type}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-600">
                      <div className="flex items-center gap-1 font-semibold text-slate-800">
                        <span>{new Date(b.checkInDate).toLocaleDateString()}</span>
                        <span>→</span>
                        <span>{new Date(b.checkOutDate).toLocaleDateString()}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{b.totalNights} Night(s)</span>
                    </td>

                    <td className="py-4 px-4 font-black text-slate-900">${b.totalPrice}</td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          b.bookingStatus === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : b.bookingStatus === 'checked-in'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : b.bookingStatus === 'checked-out'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {b.bookingStatus?.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {b.bookingStatus === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(b._id, 'checked-in')}
                            className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] shadow-sm transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Check-In</span>
                          </button>
                        )}

                        {b.bookingStatus === 'checked-in' && (
                          <button
                            onClick={() => handleUpdateStatus(b._id, 'checked-out')}
                            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shadow-sm transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Check-Out</span>
                          </button>
                        )}

                        {b.bookingStatus !== 'cancelled' && b.bookingStatus !== 'checked-out' && (
                          <button
                            onClick={() => handleUpdateStatus(b._id, 'cancelled')}
                            className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Cancel Booking"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
