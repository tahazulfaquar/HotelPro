import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import {
  ShieldCheck,
  Building,
  Users,
  DollarSign,
  TrendingUp,
  Award,
  BedDouble,
  CheckCircle2,
} from 'lucide-react';

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await api.get('/analytics/admin');
        setStats(res.data.stats);
      } catch (err) {
        console.error('Error fetching admin overview:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <span className="text-xs font-bold uppercase tracking-widest text-purple-600">
          Super Admin Console
        </span>
        <h1 className="text-3xl font-black text-slate-900 mt-1">Platform Overview & Metrics</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Global analytics, registered user bases, platform commission earnings, and multi-hotel performance
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-400">Total Platform GMV</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">${stats.platformGrossRevenue.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400 font-medium">Gross booking transactions</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-400">Platform Commission (10%)</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-600">${stats.platformCommission.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-700 font-medium">Net platform revenue</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-400">Listed Hotels</span>
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.totalHotels}</p>
          <span className="text-[11px] text-slate-400 font-medium">{stats.totalRooms} active rooms inventory</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-400">Total Accounts</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.totalUsers}</p>
          <span className="text-[11px] text-slate-400 font-medium">
            {stats.totalGuests} Guests • {stats.totalManagers} Hoteliers
          </span>
        </div>
      </div>

      {/* Top Performing Hotels */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          Top Performing Hotel Properties
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Property</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Total Reservations</th>
                <th className="py-3 px-4 text-right">Gross Booked Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.popularHotels?.map((h) => (
                <tr key={h.hotelId} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{h.name}</td>
                  <td className="py-3.5 px-4 text-slate-600">{h.city}</td>
                  <td className="py-3.5 px-4 text-slate-700 font-semibold">{h.bookingsCount} bookings</td>
                  <td className="py-3.5 px-4 font-black text-slate-900 text-right">${h.totalEarned.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
