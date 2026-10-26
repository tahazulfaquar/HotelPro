import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MapPin, Star, Sparkles, Wifi, Car, Waves, ArrowRight } from 'lucide-react';
import RatingStars from './RatingStars';

export default function HotelCard({ hotel }) {
  const [searchParams] = useSearchParams();

  // Forward existing search query (dates, guests) so booking flow is seamless
  const forwardQuery = searchParams.toString() ? `?${searchParams.toString()}` : '';

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
      {/* Photo Frame */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={hotel.thumbnail}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {hotel.featured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured Selection</span>
          </div>
        )}

        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow text-xs font-bold text-slate-800 flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{hotel.starRating} Star</span>
        </div>

        <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-teal-400" />
          <span>{hotel.city}, {hotel.country}</span>
        </div>
      </div>

      {/* Hotel Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <RatingStars rating={hotel.averageRating || 4.8} />
            <span className="text-xs text-slate-400">
              ({hotel.numReviews || 0} reviews)
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-1">
            {hotel.name}
          </h3>
          <p className="text-xs text-teal-700/80 font-medium mb-3 line-clamp-1">
            {hotel.tagline || hotel.address}
          </p>

          <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
            {hotel.description}
          </p>

          {/* Quick amenities */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {hotel.amenities?.slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
              >
                {amenity}
              </span>
            ))}
            {hotel.amenities?.length > 3 && (
              <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-md bg-teal-50 text-teal-700">
                +{hotel.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Starting from</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-900">
                ${hotel.minPrice || 149}
              </span>
              <span className="text-xs text-slate-500 font-medium">/ night</span>
            </div>
          </div>

          <Link
            to={`/hotels/${hotel._id}${forwardQuery}`}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>View Rooms</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
