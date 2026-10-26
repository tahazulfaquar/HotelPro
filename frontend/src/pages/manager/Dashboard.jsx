import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import {
  DollarSign,
  Users,
  BedDouble,
  Sparkles,
  TrendingUp,
  CalendarCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building,
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchManagerData = async () => {
    try {
      const [hotelsRes, analyticsRes] = await Promise.all([
        api.get('/hotels/manager/my-hotels'),
        api.get(`/analytics/manager${selectedHotelId ? `?hotelId=${selectedHotelId}` : ''}`),
      ]);
      setHotels(hotelsRes.data.hotels || []);
      setStats(analyticsRes.data.data);
    } catch (err) {
      console.error('Error fetching manager dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagerData();
  }, [selectedHotelId]);

  if (loading || !stats) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const roomStatus = stats.roomStatusCounts || {
    available: 0,
    occupied: 0,
    cleaning: 0,
    maintenance: 0,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 space-y-8">
      {/* Top Header & Property Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
            Property Management System
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-1">Hospitality Operations</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time occupancy metrics, front-desk arrival radar, and revenue intelligence
          </p>
        </div>

        {/* Hotel Filter Dropdown */}
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-2xl border border-slate-200 flex items-center gap-2 shadow-sm">
            <Building className="w-4 h-4 text-teal-600 ml-1" />
            <select
              value={selectedHotelId}
              onChange={(e) => setSelectedHotelId(e.target.value)}
              className="text-xs font-bold bg-transparent text-slate-800 focus:outline-none cursor-pointer pr-4"
            >
              <option value="">All Managed Hotels ({hotels.length})</option>
              {hotels.map((h) => (
                <option key={h._id} value={h._id}>
                  {h.name} ({h.city})
                </option>
              ))}
            </select>
          </div>

          <Link
            to="/manager/bookings"
            className="px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 flex items-center gap-1.5 transition-colors"
          >
            <span>Front Desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">${stats.totalRevenue.toLocaleString()}</p>
          <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Active earnings across stays</span>
          </p>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Occupancy Rate</span>
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <BedDouble className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.occupancyRate}%</p>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
            <div
              className="bg-teal-500 h-2 rounded-full transition-all"
              style={{ width: `${stats.occupancyRate}%` }}
            ></div>
          </div>
        </div>

        {/* Average Daily Rate (ADR) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Average Daily Rate</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">${stats.adr}</p>
          <p className="text-[11px] text-slate-500 mt-1">Average per room night</p>
        </div>

        {/* Today's Arrivals & Departures */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Today's Radar</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-black text-emerald-600">{stats.todayCheckIns}</p>
              <span className="text-[10px] uppercase font-bold text-slate-400">Check-Ins</span>
            </div>
            <div className="h-8 border-r border-slate-200"></div>
            <div>
              <p className="text-2xl font-black text-amber-600">{stats.todayCheckOuts}</p>
              <span className="text-[10px] uppercase font-bold text-slate-400">Check-Outs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Housekeeping Matrix & Monthly Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Housekeeping & Room Status */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Room Inventory Status</h3>
            <Link to="/manager/rooms" className="text-xs font-bold text-teal-600 hover:underline">
              Manage Rooms
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-bold text-emerald-950">Available for Guests</span>
              </div>
              <span className="text-sm font-black text-emerald-700">{roomStatus.available}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50 border border-blue-100">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs font-bold text-blue-950">Currently Occupied</span>
              </div>
              <span className="text-sm font-black text-blue-700">{roomStatus.occupied}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50 border border-amber-100">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-xs font-bold text-amber-950">Housekeeping / Cleaning</span>
              </div>
              <span className="text-sm font-black text-amber-700">{roomStatus.cleaning}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                <span className="text-xs font-bold text-slate-700">Maintenance Hold</span>
              </div>
              <span className="text-sm font-black text-slate-700">{roomStatus.maintenance}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-500">
            Total property rooms: <span className="font-bold text-slate-900">{stats.totalRooms} rooms</span>
          </div>
        </div>

        {/* Monthly Revenue Trend Visualizer */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Monthly Revenue Trend</h3>
              <p className="text-xs text-slate-400 mt-0.5">Performance over the last 6 months</p>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Confirmed Bookings
            </span>
          </div>

          {/* Bar Chart Visualizer */}
          <div className="pt-6">
            <div className="grid grid-cols-6 gap-3 sm:gap-6 items-end h-48 border-b border-slate-100 pb-2">
              {stats.monthlyRevenue?.map((m, idx) => {
                const maxRev = Math.max(...stats.monthlyRevenue.map((r) => r.revenue), 1000);
                const heightPercent = Math.max(15, Math.round((m.revenue / maxRev) * 100));

                return (
                  <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-teal-600 transition-colors">
                      ${m.revenue}
                    </span>
                    <div
                      className="w-full bg-gradient-to-t from-teal-600 to-emerald-400 rounded-xl group-hover:scale-105 transition-all shadow-sm"
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                    <span className="text-xs font-bold text-slate-700">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">Recent Front-Desk Reservations</h3>
          <Link to="/manager/bookings" className="text-xs font-bold text-teal-600 hover:underline">
            View All Bookings →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Guest</th>
                <th className="py-3 px-4">Hotel & Room</th>
                <th className="py-3 px-4">Check-In</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.recentBookings?.map((b) => (
                <tr key={b._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-teal-600">{b.bookingCode}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{b.guestName}</td>
                  <td className="py-3 px-4 text-slate-600">
                    {b.hotel?.name} (Room #{b.room?.roomNumber})
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {new Date(b.checkInDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        b.bookingStatus === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : b.bookingStatus === 'checked-in'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : b.bookingStatus === 'checked-out'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {b.bookingStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 text-right">${b.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
