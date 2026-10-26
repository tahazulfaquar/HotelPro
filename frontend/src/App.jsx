import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import HotelSearch from './pages/HotelSearch';
import HotelDetail from './pages/HotelDetail';
import Checkout from './pages/Checkout';
import BookingSuccess from './pages/guest/BookingSuccess';
import MyBookings from './pages/guest/MyBookings';

// Manager Pages
import ManagerDashboard from './pages/manager/Dashboard';
import ManagerBookings from './pages/manager/Bookings';
import ManagerRooms from './pages/manager/Rooms';
import ManagerCalendar from './pages/manager/Calendar';

// Admin Pages
import AdminOverview from './pages/admin/Overview';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-slate-50">
          <Navbar />
          <main className="flex-1 flex flex-col">
            <Routes>
              {/* Public Guest Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/hotels" element={<HotelSearch />} />
              <Route path="/hotels/:id" element={<HotelDetail />} />

              {/* Protected Guest Booking Routes */}
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/booking-confirmation/:code"
                element={
                  <ProtectedRoute>
                    <BookingSuccess />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                }
              />

              {/* Protected Hotel Manager Portal */}
              <Route
                path="/manager"
                element={
                  <ProtectedRoute allowedRoles={['manager', 'admin']}>
                    <ManagerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/bookings"
                element={
                  <ProtectedRoute allowedRoles={['manager', 'admin']}>
                    <ManagerBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/rooms"
                element={
                  <ProtectedRoute allowedRoles={['manager', 'admin']}>
                    <ManagerRooms />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/calendar"
                element={
                  <ProtectedRoute allowedRoles={['manager', 'admin']}>
                    <ManagerCalendar />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Portal */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminOverview />
                  </ProtectedRoute>
                }
              />

              {/* Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* 404 Fallback */}
              <Route
                path="*"
                element={
                  <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
                    <h2 className="text-4xl font-black text-slate-900 mb-2">404</h2>
                    <p className="text-sm text-slate-500 mb-6">Page not found</p>
                    <a
                      href="/"
                      className="px-6 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs shadow"
                    >
                      Return Home
                    </a>
                  </div>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
