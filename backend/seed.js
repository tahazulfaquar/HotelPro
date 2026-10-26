require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const User = require('./models/User');
const Hotel = require('./models/Hotel');
const Room = require('./models/Room');
const Booking = require('./models/Booking');
const Review = require('./models/Review');

const seedData = async (exitOnComplete = true) => {
  try {
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }

    console.log('🧹 Purging old data...');
    await User.deleteMany();
    await Hotel.deleteMany();
    await Room.deleteMany();
    await Booking.deleteMany();
    await Review.deleteMany();

    console.log('👤 Seeding default users...');
    const adminUser = await User.create({
      name: 'Alexander Wright (Admin)',
      email: 'admin@hotelpro.com',
      password: 'password123',
      role: 'admin',
      phone: '+1 (555) 100-0001',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80',
    });

    const managerUser = await User.create({
      name: 'Elena Rostova (General Manager)',
      email: 'manager@hotelpro.com',
      password: 'password123',
      role: 'manager',
      phone: '+1 (555) 200-0002',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    });

    const guestUser = await User.create({
      name: 'Sarah Jenkins (VIP Guest)',
      email: 'guest@hotelpro.com',
      password: 'password123',
      role: 'guest',
      phone: '+1 (555) 300-0003',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    });

    console.log('🏨 Seeding luxury hotels...');
    const hotelsData = [
      {
        name: 'The Grand Azure Resort & Spa',
        tagline: 'Oceanfront Luxury & Private Beach Club',
        description:
          'Perched directly on South Beach, The Grand Azure offers signature cabanas, Michelin-starred fine dining, an infinity edge pool overlooking the Atlantic, and an award-winning holistic sanctuary spa.',
        address: '1440 Ocean Drive',
        city: 'Miami',
        state: 'Florida',
        country: 'United States',
        zipCode: '33139',
        starRating: 5,
        featured: true,
        manager: managerUser._id,
        thumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
        ],
        amenities: [
          'Free High-Speed WiFi',
          'Infinity Swimming Pool',
          'Full-Service Spa',
          'Fitness Center',
          'Private Beach Access',
          'Valet Parking',
          'Michelin Restaurant',
          '24/7 Room Service',
        ],
        checkInTime: '15:00',
        checkOutTime: '12:00',
        averageRating: 4.9,
        numReviews: 128,
        contactEmail: 'concierge@azuremiami.com',
        contactPhone: '+1 (305) 555-0199',
      },
      {
        name: 'The Manhattan Regency',
        tagline: 'Timeless Elegance by Central Park',
        description:
          'Located in the heart of Midtown Manhattan, steps from Fifth Avenue and Broadway. Featuring bespoke art deco suites, rooftop cocktail lounges with skyline panoramas, and white-glove butler service.',
        address: '768 5th Ave',
        city: 'New York',
        state: 'New York',
        country: 'United States',
        zipCode: '10019',
        starRating: 5,
        featured: true,
        manager: managerUser._id,
        thumbnail: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
        ],
        amenities: [
          'Free High-Speed WiFi',
          'Rooftop Lounge & Bar',
          'Fine Dining Restaurant',
          'Valet Parking',
          'Concierge Butler',
          'Gym & Steam Room',
          'Pet Friendly',
        ],
        checkInTime: '15:00',
        checkOutTime: '11:00',
        averageRating: 4.8,
        numReviews: 94,
        contactEmail: 'stay@manhattanregency.com',
        contactPhone: '+1 (212) 555-0143',
      },
      {
        name: 'Emperor Palace & Onsen Suites',
        tagline: 'Modern Tranquility in Shibuya',
        description:
          'An urban oasis combining minimalist Japanese aesthetics with modern technology. Features private cedar hinoki wood soaking tubs, traditional kaiseki dining, and sweeping views of Mount Fuji.',
        address: '1-12-1 Dogenzaka',
        city: 'Tokyo',
        state: 'Tokyo Prefecture',
        country: 'Japan',
        zipCode: '150-0043',
        starRating: 5,
        featured: true,
        manager: managerUser._id,
        thumbnail: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
        ],
        amenities: [
          'Free High-Speed WiFi',
          'Traditional Natural Onsen',
          'Kaiseki Tasting Restaurant',
          'Tea Ceremony Garden',
          'Subway Direct Access',
          'Air Conditioning',
        ],
        checkInTime: '14:00',
        checkOutTime: '11:00',
        averageRating: 4.95,
        numReviews: 210,
        contactEmail: 'reservations@emperortokyo.jp',
        contactPhone: '+81 3 5555 0188',
      },
      {
        name: 'The Golden Oasis Marina Resort',
        tagline: 'Ultra-Luxury by the Palm Waterfront',
        description:
          'Redefining opulence with private yacht charter access, private beach cabanas, 7 international specialty restaurants, infinity rooftop pool, and chauffeur-driven luxury transfers.',
        address: 'Crescent Road, The Palm Jumeirah',
        city: 'Dubai',
        state: 'Dubai',
        country: 'United Arab Emirates',
        zipCode: '00000',
        starRating: 5,
        featured: false,
        manager: managerUser._id,
        thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
        ],
        amenities: [
          'Free High-Speed WiFi',
          'Private Beach Club',
          'Infinity Sky Pool',
          '7 Award-Winning Restaurants',
          'Luxury Airport Chauffeur',
          'Heliport Access',
          'Kids Adventure Club',
        ],
        checkInTime: '15:00',
        checkOutTime: '12:00',
        averageRating: 4.9,
        numReviews: 87,
        contactEmail: 'vip@goldenoasisdubai.ae',
        contactPhone: '+971 4 555 0999',
      },
      {
        name: 'San Francisco Bay Heritage Hotel',
        tagline: 'Panoramic Golden Gate Views on Nob Hill',
        description:
          'Historic luxury situated atop fashionable Nob Hill. Cable cars at your doorstep, sweeping views of Alcatraz and the Golden Gate, and cozy California wine tastings every evening.',
        address: '950 California St',
        city: 'San Francisco',
        state: 'California',
        country: 'United States',
        zipCode: '94108',
        starRating: 4,
        featured: false,
        manager: managerUser._id,
        thumbnail: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
        ],
        amenities: [
          'Free High-Speed WiFi',
          'Evening Wine Tasting Hour',
          'Cable Car Access',
          'Fitness Club',
          'Artisan Coffee Roasters',
          'Pet Friendly',
        ],
        checkInTime: '15:00',
        checkOutTime: '11:00',
        averageRating: 4.7,
        numReviews: 65,
        contactEmail: 'stay@sfheritage.com',
        contactPhone: '+1 (415) 555-0812',
      },
    ];

    const createdHotels = await Hotel.insertMany(hotelsData);
    console.log(`✅ Seeded ${createdHotels.length} hotels.`);

    console.log('🛏️ Seeding rooms for each hotel...');
    const roomPrototypes = [
      {
        roomNumber: '101',
        type: 'Standard Double',
        title: 'Superior Garden View Double',
        basePrice: 160,
        capacity: { adults: 2, children: 1 },
        bedType: '2 Queen Beds',
        sizeSqFt: 380,
        amenities: ['Free WiFi', '50" Smart TV', 'Rain Shower', 'Work Desk', 'Mini Fridge'],
        images: [
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        ],
        status: 'available',
      },
      {
        roomNumber: '201',
        type: 'Deluxe King',
        title: 'Deluxe Ocean Panorama King',
        basePrice: 280,
        capacity: { adults: 2, children: 1 },
        bedType: '1 King Size Bed',
        sizeSqFt: 460,
        amenities: [
          'Free High-Speed WiFi',
          'Private Balcony',
          'Marble Bathroom & Deep Soaking Tub',
          'Nespresso Bar',
          'Bluetooth Speaker',
        ],
        images: [
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
        ],
        status: 'available',
      },
      {
        roomNumber: '301',
        type: 'Executive Suite',
        title: 'Skyline Executive Corner Suite',
        basePrice: 480,
        capacity: { adults: 3, children: 2 },
        bedType: '1 King Bed + 1 Queen Sofa Bed',
        sizeSqFt: 720,
        amenities: [
          'Separate Living & Dining Salon',
          'Floor-to-Ceiling Windows',
          'Executive Club Lounge Access',
          'Complimentary Breakfast',
          'Walk-in Dressing Room',
        ],
        images: [
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
        ],
        status: 'available',
      },
      {
        roomNumber: 'PH-1',
        type: 'Presidential Suite',
        title: 'Royal Penthouse with Private Terrace',
        basePrice: 950,
        capacity: { adults: 4, children: 2 },
        bedType: '2 King Master Suites',
        sizeSqFt: 1400,
        amenities: [
          'Private Rooftop Jacuzzi',
          'Personal Butler Service',
          'Full Designer Kitchen',
          'Chauffeur Airport Transfers',
          'VIP Champagne on Arrival',
        ],
        images: [
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80',
        ],
        status: 'available',
      },
    ];

    let allCreatedRooms = [];
    for (const hotel of createdHotels) {
      for (const proto of roomPrototypes) {
        const room = await Room.create({
          ...proto,
          hotel: hotel._id,
        });
        allCreatedRooms.push(room);
      }
    }
    console.log(`✅ Seeded ${allCreatedRooms.length} rooms.`);

    console.log('📅 Seeding realistic bookings & guest history...');
    const firstHotel = createdHotels[0];
    const firstRoom = allCreatedRooms.find((r) => r.hotel.toString() === firstHotel._id.toString());
    const secondRoom = allCreatedRooms.find(
      (r) => r.hotel.toString() === firstHotel._id.toString() && r.roomNumber === '201'
    );

    const checkInSample = new Date();
    checkInSample.setDate(checkInSample.getDate() + 5);
    const checkOutSample = new Date(checkInSample);
    checkOutSample.setDate(checkOutSample.getDate() + 3);

    const booking1 = await Booking.create({
      bookingCode: 'HP-782910',
      user: guestUser._id,
      hotel: firstHotel._id,
      room: firstRoom._id,
      checkInDate: checkInSample,
      checkOutDate: checkOutSample,
      totalNights: 3,
      totalGuests: { adults: 2, children: 1 },
      guestName: guestUser.name,
      guestEmail: guestUser.email,
      guestPhone: guestUser.phone,
      specialRequests: 'High floor preferred and early check-in if possible.',
      pricePerNight: firstRoom.basePrice,
      roomPrice: firstRoom.basePrice * 3,
      taxAmount: Math.round(firstRoom.basePrice * 3 * 0.12),
      serviceFee: 25,
      totalPrice: Math.round(firstRoom.basePrice * 3 * 1.12 + 25),
      paymentStatus: 'paid',
      paymentMethod: 'card_simulation',
      paymentId: 'PAY-172900-MOCK',
      bookingStatus: 'confirmed',
    });

    // Past completed stay with review
    const pastCheckIn = new Date();
    pastCheckIn.setDate(pastCheckIn.getDate() - 14);
    const pastCheckOut = new Date(pastCheckIn);
    pastCheckOut.setDate(pastCheckOut.getDate() + 4);

    const booking2 = await Booking.create({
      bookingCode: 'HP-449102',
      user: guestUser._id,
      hotel: firstHotel._id,
      room: secondRoom._id,
      checkInDate: pastCheckIn,
      checkOutDate: pastCheckOut,
      totalNights: 4,
      totalGuests: { adults: 2, children: 0 },
      guestName: guestUser.name,
      guestEmail: guestUser.email,
      guestPhone: guestUser.phone,
      pricePerNight: secondRoom.basePrice,
      roomPrice: secondRoom.basePrice * 4,
      taxAmount: Math.round(secondRoom.basePrice * 4 * 0.12),
      serviceFee: 25,
      totalPrice: Math.round(secondRoom.basePrice * 4 * 1.12 + 25),
      paymentStatus: 'paid',
      paymentMethod: 'card_simulation',
      paymentId: 'PAY-172800-MOCK',
      bookingStatus: 'checked-out',
      hasReviewed: true,
    });

    console.log('⭐ Seeding reviews...');
    await Review.create({
      user: guestUser._id,
      hotel: firstHotel._id,
      booking: booking2._id,
      rating: 5,
      title: 'Unforgettable oceanfront paradise!',
      comment:
        'From the moment we arrived, the staff greeted us with refreshing cocktails and pristine hospitality. The ocean panorama room was stunning with floor-to-ceiling balcony views. The infinity pool cabana service is worth every penny!',
    });

    await Review.create({
      user: adminUser._id,
      hotel: createdHotels[1]._id, // New York
      rating: 5,
      title: 'Supreme elegance in Midtown NYC',
      comment:
        'The rooftop cocktails overlooking Central Park are unmatched. The concierge secured impossible dinner reservations with ease. Highly recommended for business and leisure alike.',
    });

    console.log('\n🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('====================================================');
    console.log('🔑 TEST ACCOUNTS CREATED:');
    console.log('   1. Guest Account:');
    console.log('      Email: guest@hotelpro.com | Password: password123');
    console.log('   2. Hotel Manager Account:');
    console.log('      Email: manager@hotelpro.com | Password: password123');
    console.log('   3. Platform Administrator:');
    console.log('      Email: admin@hotelpro.com | Password: password123');
    console.log('====================================================\n');

    if (exitOnComplete) {
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Seeding error:', error);
    if (exitOnComplete) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedData(true);
}

module.exports = { seedData };
