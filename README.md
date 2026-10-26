# 🏨 HotelPro - Complete Hotel Booking & Property Management Solution

An enterprise-grade, full-stack **MERN (MongoDB, Express.js, React, Node.js)** hotel booking platform and Property Management System (PMS) designed with modern architecture, role-based workflows, real-time availability tracking, and revenue analytics.

---

## 🌟 Key Highlights & Features

### 1. 🧳 Guest & Traveler Experience
- **Dynamic Search & Discovery**: Filter stays by destination city, check-in/out dates, guest count, price range slider, star rating, and amenities (WiFi, Pool, Spa, Gym, Beach access).
- **Interactive Hotel Showcase**: High-resolution image galleries, amenity badges, location details, and verified guest reviews.
- **Double-Booking Prevention Engine**: Robust interval overlap verification `(requestedCheckIn < existingCheckOut) && (requestedCheckOut > existingCheckIn)` ensures zero double-booking collisions.
- **Seamless Checkout**: Price breakdown with live nightly totals, state hospitality tax calculations, service fee, and instant test payment simulation.
- **Downloadable & Printable Vouchers**: Instant reservation confirmation with printable booking reference vouchers (`HP-XXXXXX`).
- **Guest Reservation Hub**: View upcoming stays, in-house active stays, completed trips, cancellation with instant refunds, and guest review submissions.

### 2. 🛎️ Hotel Manager & Front-Desk Portal (`/manager`)
- **Operations Dashboard**: Real-time KPI summary (Total Revenue, Occupancy Rate %, Average Daily Rate ADR, Today's Check-ins & Check-outs, 6-Month Monthly Revenue trend).
- **Housekeeping & Room Matrix**: Track rooms across live lifecycle stages (`🟢 Available`, `🔵 Occupied`, `🟡 Needs Cleaning`, `⚪ Maintenance Hold`).
- **Front-Desk Command Center (`/manager/bookings`)**: 
  - 1-Click Check-In (automatically shifts room status to *Occupied*).
  - 1-Click Check-Out (automatically shifts room status to *Needs Cleaning*).
  - Reservation search and cancellation management.
- **Room Calendar Matrix (`/manager/calendar`)**: Month-by-month bird's-eye occupancy schedule across all property rooms.
- **Inventory Management (`/manager/rooms`)**: Add new rooms, adjust nightly pricing, change bed types, and manage room photos.

### 3. 🛡️ Super Admin Console (`/admin`)
- **Platform Analytics**: Global GMV volume, platform 10% commission revenue, registered guest counts, and manager counts.
- **Top Hotel Performance**: Revenue-ranked leaderboards of registered properties.

---

## 🔑 Test Credentials (1-Click Login Enabled)

On the Login screen, click any of the **1-Click Instant Demo Login** persona buttons to log in automatically:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **VIP Guest** | `guest@hotelpro.com` | `password123` | Search, book rooms, cancel, view vouchers, write reviews |
| **Hotel Manager** | `manager@hotelpro.com` | `password123` | Manager Dashboard, Front-Desk, Room Inventory, Calendar |
| **Super Admin** | `admin@hotelpro.com` | `password123` | System GMV metrics, platform overview, all properties |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+) & npm

### 1. Run the Full Application (Single Command)
```bash
# In the root hotelpro directory:
npm run dev
```
> **Zero Database Friction**: If you don't have MongoDB installed locally, HotelPro **automatically starts an in-memory MongoDB server** with sample hotels, rooms, and test accounts pre-seeded. Everything works out-of-the-box!

- **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- **Backend API Gateway**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

### Optional: Running with Local MongoDB or Docker

#### Using Local MongoDB:
Create or edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/hotelpro
JWT_SECRET=hotelpro_jwt_super_secret_key_2026
```

#### Using Docker:
```bash
docker compose up -d
```
MongoDB will be available on `mongodb://localhost:27017`, and Mongo-Express GUI on `http://localhost:8081`.

#### Re-seed Database:
```bash
npm run seed
```

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new Guest or Manager |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT |
| `GET` | `/api/auth/me` | Private | Get current user profile |
| `PUT` | `/api/auth/profile` | Private | Update user details |

### Hotels (`/api/hotels`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/hotels` | Public | Search hotels with filters (city, price, star, amenities) |
| `GET` | `/api/hotels/featured` | Public | Top handpicked luxury stays |
| `GET` | `/api/hotels/destinations`| Public | Popular cities with property counts |
| `GET` | `/api/hotels/:id` | Public | Hotel profile with rooms and reviews |
| `POST` | `/api/hotels` | Manager/Admin | Create new hotel listing |
| `PUT` | `/api/hotels/:id` | Manager/Admin | Update hotel listing |
| `DELETE` | `/api/hotels/:id` | Admin | Delete hotel listing |

### Rooms & Inventory (`/api/rooms`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/rooms/hotel/:hotelId` | Public | Get rooms with live availability for given date range |
| `GET` | `/api/rooms/:id` | Public | Get room details |
| `POST` | `/api/rooms` | Manager/Admin | Add room to hotel inventory |
| `PATCH` | `/api/rooms/:id/status` | Manager/Admin | Toggle housekeeping status (`available`, `occupied`, `cleaning`, `maintenance`) |

### Bookings (`/api/bookings`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/bookings` | Private | Create booking with conflict check |
| `GET` | `/api/bookings/my-bookings` | Private | Guest's reservations history |
| `GET` | `/api/bookings/:idOrCode` | Private | Get booking voucher / invoice |
| `PUT` | `/api/bookings/:id/cancel` | Private | Cancel booking & issue refund |
| `GET` | `/api/bookings/manager/all` | Manager/Admin | Filter front-desk reservations |
| `PATCH`| `/api/bookings/:id/status` | Manager/Admin | Update status (`checked-in`, `checked-out`, `cancelled`) |

### Analytics & Reporting (`/api/analytics`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/analytics/manager` | Manager/Admin | Occupancy rate, ADR, monthly revenue trend |
| `GET` | `/api/analytics/calendar` | Manager/Admin | Matrix calendar of rooms and booking dates |
| `GET` | `/api/analytics/admin` | Admin | Global platform GMV and revenue |

---

## 🏗️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v7, Lucide Icons, Axios, date-fns.
- **Backend**: Node.js, Express.js, Mongoose, JWT (jsonwebtoken), Bcryptjs, Morgan, CORS.
- **Database**: MongoDB (Atlas, local, or embedded in-memory fallback).
