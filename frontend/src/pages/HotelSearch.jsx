import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import HotelCard from '../components/HotelCard';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Calendar,
  X,
  Star,
  Check,
  RefreshCw,
} from 'lucide-react';

export default function HotelSearch() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Filter state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '1000');
  const [starRating, setStarRating] = useState(searchParams.getAll('starRating').map(Number));
  const [selectedAmenities, setSelectedAmenities] = useState(
    searchParams.get('amenities') ? searchParams.get('amenities').split(',') : []
  );
  const [sort, setSort] = useState(searchParams.get('sort') || 'rating_desc');
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [guests, setGuests] = useState(searchParams.get('guests') || '2');

  const availableAmenities = [
    'Free High-Speed WiFi',
    'Swimming Pool',
    'Full-Service Spa',
    'Fitness Center',
    'Valet Parking',
    'Michelin Restaurant',
    'Private Beach Access',
    'Pet Friendly',
    'Rooftop Lounge & Bar',
  ];

  const popularCities = ['All', 'Miami', 'New York', 'Tokyo', 'Dubai', 'San Francisco'];

  const fetchFilteredHotels = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (city && city !== 'All') params.append('city', city);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (starRating.length > 0) {
        starRating.forEach((s) => params.append('starRating', s));
      }
      if (selectedAmenities.length > 0) {
        params.append('amenities', selectedAmenities.join(','));
      }
      if (sort) params.append('sort', sort);
      if (checkIn) params.append('checkIn', checkIn);
      if (checkOut) params.append('checkOut', checkOut);
      if (guests) params.append('guests', guests);

      setSearchParams(params);

      const res = await api.get(`/hotels?${params.toString()}`);
      setHotels(res.data.hotels || []);
    } catch (err) {
      console.error('Error fetching hotels:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredHotels();
  }, [city, maxPrice, starRating, selectedAmenities, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFilteredHotels();
  };

  const toggleStar = (star) => {
    if (starRating.includes(star)) {
      setStarRating(starRating.filter((s) => s !== star));
    } else {
      setStarRating([...starRating, star]);
    }
  };

  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setCity('');
    setMinPrice('');
    setMaxPrice('1000');
    setStarRating([]);
    setSelectedAmenities([]);
    setSort('rating_desc');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      {/* Top Search Controls Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200/80 mb-8">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search hotel name or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div className="relative">
            <MapPin className="w-5 h-5 text-teal-600 absolute left-3.5 top-3.5" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer"
            >
              <option value="">All Destinations</option>
              {popularCities.filter(c => c !== 'All').map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              placeholder="Check-In"
              className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none"
            />
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn}
              placeholder="Check-Out"
              className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Filter Stays</span>
            </button>
            <button
              type="button"
              onClick={() => setShowMobileFilter(!showMobileFilter)}
              className="md:hidden p-3 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar Filters */}
        <aside
          className={`${
            showMobileFilter ? 'block fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden'
          } lg:block lg:relative lg:inset-auto lg:p-0 lg:bg-transparent space-y-6`}
        >
          {showMobileFilter && (
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <h3 className="font-bold text-lg text-slate-900">Filters</h3>
              <button onClick={() => setShowMobileFilter(false)} className="p-1 text-slate-500">
                <X className="w-6 h-6" />
              </button>
            </div>
          )}

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <SlidersHorizontal className="w-4 h-4 text-teal-600" />
                Refine Search
              </h4>
              <button
                onClick={resetFilters}
                className="text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Price Slider */}
            <div className="border-t border-slate-100 pt-5">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase">Max Nightly Price</label>
                <span className="text-sm font-black text-teal-600">${maxPrice}</span>
              </div>
              <input
                type="range"
                min="100"
                max="1200"
                step="25"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>$100</span>
                <span>$1200+</span>
              </div>
            </div>

            {/* Star Rating Checkbox */}
            <div className="border-t border-slate-100 pt-5">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-3">Star Rating</label>
              <div className="space-y-2">
                {[5, 4, 3].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => toggleStar(star)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors border ${
                      starRating.includes(star)
                        ? 'bg-teal-50 border-teal-300 text-teal-900'
                        : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {[...Array(star)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="ml-1 font-bold">{star} Star Hotels</span>
                    </div>
                    {starRating.includes(star) && <Check className="w-4 h-4 text-teal-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities Filters */}
            <div className="border-t border-slate-100 pt-5">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-3">Amenities</label>
              <div className="space-y-2">
                {availableAmenities.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center gap-2 text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Search Results */}
        <main className="lg:col-span-3">
          {/* Header & Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                {city ? `${city} Hotels` : 'All Accommodations'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing {hotels.length} verified luxury properties
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-white border border-slate-200 text-xs font-bold text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer shadow-sm"
              >
                <option value="rating_desc">Highest Guest Rating</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-80 bg-slate-200 animate-pulse rounded-3xl"></div>
              ))}
            </div>
          ) : hotels.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No properties matched your criteria</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                Try widening your price range, clearing amenities, or picking a different destination city.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-sm shadow hover:bg-teal-700 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hotels.map((hotel) => (
                <HotelCard key={hotel._id} hotel={hotel} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
