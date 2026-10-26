import React from 'react';
import { Building2, Heart, Shield, Award, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Hotel<span className="text-teal-400">Pro</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Curating exceptional hotel stays, boutique accommodations, and luxury retreats worldwide. Empowering hoteliers with state-of-the-art property management intelligence.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Shield className="w-4 h-4 text-teal-400" />
                <span>Verified Cleanliness</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Best Rate Guarantee</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/hotels" className="hover:text-teal-400 transition-colors">
                  All Properties
                </Link>
              </li>
              <li>
                <Link to="/hotels?city=Miami" className="hover:text-teal-400 transition-colors">
                  Miami Beach Resorts
                </Link>
              </li>
              <li>
                <Link to="/hotels?city=New+York" className="hover:text-teal-400 transition-colors">
                  New York Suites
                </Link>
              </li>
              <li>
                <Link to="/hotels?city=Tokyo" className="hover:text-teal-400 transition-colors">
                  Tokyo Luxury Ryokans
                </Link>
              </li>
              <li>
                <Link to="/hotels?city=Dubai" className="hover:text-teal-400 transition-colors">
                  Dubai Waterfront
                </Link>
              </li>
            </ul>
          </div>

          {/* Solution Portals */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Portals
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/my-bookings" className="hover:text-teal-400 transition-colors">
                  Guest Reservation Hub
                </Link>
              </li>
              <li>
                <Link to="/manager" className="hover:text-teal-400 transition-colors">
                  Hotel Manager Portal
                </Link>
              </li>
              <li>
                <Link to="/manager/bookings" className="hover:text-teal-400 transition-colors">
                  Front-Desk Operations
                </Link>
              </li>
              <li>
                <Link to="/manager/calendar" className="hover:text-teal-400 transition-colors">
                  Room Matrix Calendar
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-teal-400 transition-colors">
                  Super Admin Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Support & Inquiries
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>+1 (800) 555-HOTEL</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>concierge@hotelpro.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Midtown Tower, New York, NY</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} HotelPro Inc. Complete Hotel Booking & Management Solution. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Safeguards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
