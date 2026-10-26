import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import {
  BedDouble,
  Plus,
  Building,
  CheckCircle2,
  Users,
  DollarSign,
  Maximize2,
  Trash2,
  Edit,
  X,
  Sparkles,
} from 'lucide-react';

export default function Rooms() {
  const [hotels, setHotels] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState('');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState('');

  // Add Room Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [roomNumber, setRoomNumber] = useState('');
  const [roomType, setRoomType] = useState('Deluxe King');
  const [roomTitle, setRoomTitle] = useState('');
  const [basePrice, setBasePrice] = useState(199);
  const [adults, setAdults] = useState(2);
  const [bedType, setBedType] = useState('1 King Size Bed');
  const [sizeSqFt, setSizeSqFt] = useState(420);
  const [savingRoom, setSavingRoom] = useState(false);

  const fetchHotels = async () => {
    try {
      const res = await api.get('/hotels/manager/my-hotels');
      const fetchedHotels = res.data.hotels || [];
      setHotels(fetchedHotels);
      if (fetchedHotels.length > 0 && !selectedHotelId) {
        setSelectedHotelId(fetchedHotels[0]._id);
      }
    } catch (err) {
      console.error('Failed to load hotels:', err);
    }
  };

  const fetchRooms = async () => {
    if (!selectedHotelId) return;
    setLoading(true);
    try {
      const res = await api.get(`/rooms/hotel/${selectedHotelId}`);
      setRooms(res.data.rooms || []);
    } catch (err) {
      console.error('Failed to load rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [selectedHotelId]);

  const handleStatusChange = async (roomId, newStatus) => {
    try {
      await api.patch(`/rooms/${roomId}/status`, { status: newStatus });
      setActionSuccess(`Room status updated to ${newStatus}`);
      setTimeout(() => setActionSuccess(''), 3000);
      fetchRooms();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update room status');
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    setSavingRoom(true);
    try {
      await api.post('/rooms', {
        hotel: selectedHotelId,
        roomNumber,
        type: roomType,
        title: roomTitle || `${roomType} Suite`,
        basePrice: Number(basePrice),
        capacity: { adults: Number(adults), children: 1 },
        bedType,
        sizeSqFt: Number(sizeSqFt),
        images: [
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
        ],
      });

      setActionSuccess(`Room #${roomNumber} created successfully!`);
      setModalOpen(false);
      setRoomNumber('');
      setRoomTitle('');
      setTimeout(() => setActionSuccess(''), 4000);
      fetchRooms();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add room');
    } finally {
      setSavingRoom(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
            Inventory & Housekeeping
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-1">Room Inventory Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure room pricing, occupancy limits, and housekeeping cleaning cycles
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Hotel selector */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200 flex items-center gap-2 shadow-sm">
            <Building className="w-4 h-4 text-teal-600 ml-1" />
            <select
              value={selectedHotelId}
              onChange={(e) => setSelectedHotelId(e.target.value)}
              className="text-xs font-bold bg-transparent text-slate-800 focus:outline-none cursor-pointer pr-4"
            >
              {hotels.map((h) => (
                <option key={h._id} value={h._id}>
                  {h.name} ({h.city})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Room</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Rooms Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 bg-slate-200 animate-pulse rounded-3xl"></div>
          ))}
        </div>
      ) : rooms.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 text-xs">
          No rooms created for this hotel yet. Click "+ Add Room" to add inventory.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-slate-900 font-mono">
                    Room #{room.roomNumber}
                  </span>
                  <span className="text-[10px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-200">
                    {room.type}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-slate-900">${room.basePrice}</span>
                  <span className="text-[10px] text-slate-400 block -mt-1">/ night</span>
                </div>
              </div>

              <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80'}
                  alt={room.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{room.title}</h4>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>{room.bedType}</span>
                  <span>•</span>
                  <span>{room.sizeSqFt} sq ft</span>
                  <span>•</span>
                  <span>{room.capacity?.adults} Guests</span>
                </div>
              </div>

              {/* Status Selector Dropdown */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">PMS Status:</span>
                <select
                  value={room.status}
                  onChange={(e) => handleStatusChange(room._id, e.target.value)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border cursor-pointer focus:outline-none ${
                    room.status === 'available'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : room.status === 'occupied'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : room.status === 'cleaning'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  <option value="available">🟢 Available</option>
                  <option value="occupied">🔵 Occupied (In-House)</option>
                  <option value="cleaning">🟡 Needs Cleaning</option>
                  <option value="maintenance">⚪ Maintenance</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Room Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-teal-600" />
                Add Room To Inventory
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRoom} className="space-y-4 text-xs font-bold text-slate-700">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Room Number / ID</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 402, PH-2"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block mb-1">Room Category</label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Standard Single">Standard Single</option>
                    <option value="Standard Double">Standard Double</option>
                    <option value="Deluxe King">Deluxe King</option>
                    <option value="Executive Suite">Executive Suite</option>
                    <option value="Presidential Suite">Presidential Suite</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1">Display Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deluxe Ocean View Suite"
                  value={roomTitle}
                  onChange={(e) => setRoomTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block mb-1">Base Price ($)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block mb-1">Max Adults</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={adults}
                    onChange={(e) => setAdults(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block mb-1">Size (sq ft)</label>
                  <input
                    type="number"
                    value={sizeSqFt}
                    onChange={(e) => setSizeSqFt(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Bed Configuration</label>
                <input
                  type="text"
                  value={bedType}
                  onChange={(e) => setBedType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingRoom}
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 shadow disabled:opacity-50"
                >
                  {savingRoom ? 'Saving...' : 'Add Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
