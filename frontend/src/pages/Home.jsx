import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';
import {
  Sparkles,
  ShieldCheck,
  Award,
  Clock,
  ArrowRight,
  TrendingUp,
  MapPin,
  Building,
} from 'lucide-react';

export default function Home() {
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const [hotelsRes, destRes] = await Promise.all([
          api.get('/hotels/featured'),
          api.get('/hotels/destinations'),
        ]);
        setFeaturedHotels(hotelsRes.data.hotels || []);
        setDestinations(destRes.data.destinations || []);
      } catch (err) {
        console.error('Failed to load landing data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingData();
  }, []);

  return (
    <div className="flex-1 pb-20">
      {/* Hero Section */}
      <div className="relative bg-slate-900 text-white overflow-hidden">
        {/* Background photo with overlay gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=80"
            alt="Luxury Hotel"
            className="w-full h-full object-cover opacity-35 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 md:pt-28 md:pb-36 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-400/30 text-teal-300 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Premier Hotel Experience</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight max-w-4xl mx-auto mb-6">
            Discover Stays Designed to <span className="bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent">Inspire</span> & Relax.
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            From iconic metropolitan penthouses to tranquil oceanfront sanctuaries. Seamless reservations, instant confirmation, and world-class hospitality.
          </p>
        </div>
      </div>

      {/* Floating Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SearchBar />
      </div>

      {/* Value Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Guaranteed Booking</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Real-time room calendar sync guarantees zero double-bookings or reservation conflicts.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Best Rates Directly</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Transparent pricing with no hidden surprises, complimentary upgrades, and instant invoices.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Flexible Cancellation</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Change of plans? Cancel easily directly from your guest reservation hub with instant refunds.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Hotelier PMS Portal</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Integrated property management for managers to control rooms, pricing, and front-desk check-ins.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-600 mb-2">
              <TrendingUp className="w-4 h-4" />
              <span>Handpicked Collection</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900">
              Featured Luxury Stays
            </h2>
          </div>
          <Link
            to="/hotels"
            className="inline-flex items-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors"
          >
            <span>Explore all properties</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-slate-200 animate-pulse rounded-3xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredHotels.map((hotel) => (
              <HotelCard key={hotel._id} hotel={hotel} />
            ))}
          </div>
        )}
      </section>

      {/* Popular Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-600 mb-2">
            <MapPin className="w-4 h-4" />
            <span>Top Destinations</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900">
            Explore Prime Travel Cities
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Discover world-class resorts and urban sanctuaries in the world's most sought-after cities.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {destinations.map((dest, idx) => (
            <Link
              key={idx}
              to={`/hotels?city=${dest.city}`}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-slate-900 shadow-sm hover:shadow-xl transition-all hover:scale-[1.02]"
            >
              <img
                src={dest.image}
                alt={dest.city}
                className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-base font-black tracking-tight">{dest.city}</p>
                <p className="text-xs text-teal-300 font-medium">
                  {dest.count} {dest.count === 1 ? 'Property' : 'Properties'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Hotelier Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400">
              For Hoteliers & Property Managers
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-2 mb-4 leading-tight">
              Manage your hotel operations with HotelPro Enterprise PMS
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
              Track real-time room occupancy, manage room cleaning schedules, handle guest walk-in & digital check-ins, and inspect revenue KPIs with ease.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/manager"
                className="px-6 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-teal-500/20 hover:scale-105"
              >
                Access Manager Portal
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur transition-all"
              >
                Sign In With Demo Accounts
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
