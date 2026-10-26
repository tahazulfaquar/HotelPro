import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 5, size = 'w-4 h-4', showNumber = true }) {
  const rounded = Math.round(rating * 10) / 10;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-300'
            }`}
          />
        ))}
      </div>
      {showNumber && (
        <span className="text-xs font-semibold text-slate-700 bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200">
          {rounded.toFixed(1)}
        </span>
      )}
    </div>
  );
}
