import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

export default function SearchBar({ initialCity = '', initialCheckIn = '', initialCheckOut = '', initialGuests = 2 }) {
  const navigate = useNavigate();

  // Helper defaults: today + 1 day for check-in, today + 3 days for check-out
  const getDefaultDates = () => {
    const today = new Date();
    const inDate = new Date(today);
    inDate.setDate(today.getDate() + 1);
    const outDate = new Date(today);
    outDate.setDate(today.getDate() + 4);

    return {
      checkIn: inDate.toISOString().split('T')[0],
      checkOut: outDate.toISOString().split('T')[0],
    };
  };

  const defaultDates = getDefaultDates();
  const [city, setCity] = useState(initialCity);
  const [checkIn, setCheckIn] = useState(initialCheckIn || defaultDates.checkIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut || defaultDates.checkOut);
  const [guests, setGuests] = useState(initialGuests || 2);

  const popularCities = ['All', 'Miami', 'New York', 'Tokyo', 'Dubai', 'San Francisco'];

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city && city !== 'All') params.append('city', city);
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    if (guests) params.append('guests', guests);

    navigate(`/hotels?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-slate-100 max-w-5xl mx-auto -mt-12 relative z-20">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 items-center">
        {/* Destination */}
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 transition-colors">
          <MapPin className="w-5 h-5 text-teal-600 shrink-0" />
          <div className="w-full">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Destination
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="">Any Destination</option>
              {popularCities.filter(c => c !== 'All').map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Check-In */}
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 transition-colors">
          <Calendar className="w-5 h-5 text-teal-600 shrink-0" />
          <div className="w-full">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Check-In
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Check-Out */}
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 transition-colors">
          <Calendar className="w-5 h-5 text-teal-600 shrink-0" />
          <div className="w-full">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Check-Out
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Guests & Search Button */}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 transition-colors">
            <Users className="w-5 h-5 text-teal-600 shrink-0" />
            <div className="w-full">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value={1}>1 Guest</option>
                <option value={2}>2 Guests</option>
                <option value={3}>3 Guests</option>
                <option value={4}>4+ Guests</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="h-[58px] px-6 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-600/30 transition-all hover:scale-[1.02] shrink-0"
          >
            <Search className="w-5 h-5" />
            <span className="hidden lg:inline">Find Stays</span>
          </button>
        </div>
      </form>
    </div>
  );
}
