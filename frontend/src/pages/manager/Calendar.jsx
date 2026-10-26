import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import {
  Calendar as CalendarIcon,
  Building,
  ChevronLeft,
  ChevronRight,
  Info,
} from 'lucide-react';

export default function Calendar() {
  const [hotels, setHotels] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState('');
  const [matrixData, setMatrixData] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth());
  const [year, setYear] = useState(currentDate.getFullYear());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const fetchHotels = async () => {
    try {
      const res = await api.get('/hotels/manager/my-hotels');
      const hList = res.data.hotels || [];
      setHotels(hList);
      if (hList.length > 0 && !selectedHotelId) {
        setSelectedHotelId(hList[0]._id);
      }
    } catch (err) {
      console.error('Failed to load manager hotels:', err);
    }
  };

  const fetchMatrix = async () => {
    if (!selectedHotelId) return;
    setLoading(true);
    try {
      const res = await api.get('/analytics/calendar', {
        params: { hotelId: selectedHotelId, month, year },
      });
      setMatrixData(res.data);
    } catch (err) {
      console.error('Failed to load room matrix:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    fetchMatrix();
  }, [selectedHotelId, month, year]);

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const daysCount = matrixData?.daysInMonth || 30;
  const daysArray = Array.from({ length: daysCount }, (_, i) => i + 1);

  // Helper to check if a room is booked on day d
  const getBookingForRoomDay = (roomId, day) => {
    if (!matrixData?.bookings) return null;
    const targetDate = new Date(year, month, day);

    return matrixData.bookings.find((b) => {
      if (b.room.toString() !== roomId.toString()) return false;
      const bIn = new Date(b.checkInDate);
      const bOut = new Date(b.checkOutDate);
      bIn.setHours(0, 0, 0, 0);
      bOut.setHours(23, 59, 59, 999);
      return targetDate >= bIn && targetDate <= bOut;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
            Occupancy Timeline
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-1">Room Calendar Matrix</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Bird's-eye occupancy schedule across all property rooms for {monthNames[month]} {year}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white p-2 rounded-2xl border border-slate-200 flex items-center gap-2 shadow-sm">
            <Building className="w-4 h-4 text-teal-600 ml-1" />
            <select
              value={selectedHotelId}
              onChange={(e) => setSelectedHotelId(e.target.value)}
              className="text-xs font-bold bg-transparent text-slate-800 focus:outline-none cursor-pointer pr-4"
            >
              {hotels.map((h) => (
                <option key={h._id} value={h._id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold px-3 text-slate-800 min-w-28 text-center">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-slate-600 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-teal-500 shadow-sm"></div>
          <span className="font-semibold">Confirmed / In-House Stay</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-slate-100 border border-slate-300"></div>
          <span className="font-semibold">Available for Booking</span>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : !matrixData?.rooms || matrixData.rooms.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No rooms found for this property.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 font-bold uppercase">
                  <th className="py-3 px-4 text-left sticky left-0 bg-slate-50 z-10 w-44 min-w-44 border-r border-slate-200">
                    Room
                  </th>
                  {daysArray.map((day) => (
                    <th key={day} className="py-3 px-1 min-w-9 border-r border-slate-100 font-mono">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {matrixData.rooms.map((room) => (
                  <tr key={room._id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 text-left font-bold text-slate-800 sticky left-0 bg-white z-10 border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                      <p className="font-mono text-teal-700">#{room.roomNumber}</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-36">{room.type}</p>
                    </td>

                    {daysArray.map((day) => {
                      const booking = getBookingForRoomDay(room._id, day);

                      return (
                        <td key={day} className="p-1 border-r border-slate-100 relative group">
                          {booking ? (
                            <div
                              className="h-8 rounded-lg bg-teal-500 text-white flex items-center justify-center font-bold text-[10px] shadow-sm cursor-pointer hover:bg-teal-600 transition-colors"
                              title={`${booking.guestName} (${booking.bookingCode})`}
                            >
                              •
                            </div>
                          ) : (
                            <div className="h-8 rounded-lg bg-slate-50/60 hover:bg-emerald-50 transition-colors flex items-center justify-center text-slate-300">
                              -
                            </div>
                          )}
                        </td>
                      );
                    })}
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
