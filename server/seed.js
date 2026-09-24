require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Property = require('./models/Property');
const Application = require('./models/Application');
const Agreement = require('./models/Agreement');
const Rent = require('./models/Rent');
const Payment = require('./models/Payment');
const Maintenance = require('./models/Maintenance');
const Notification = require('./models/Notification');
const Complaint = require('./models/Complaint');
const AuditLog = require('./models/AuditLog');
const Favorite = require('./models/Favorite');

const sampleProperties = [
  {
    title: 'Skyline Luxury 3BHK Penthouse with Sea View',
    description: 'Breathtaking 3BHK penthouse featuring panoramic views of the Arabian Sea, private rooftop deck, Italian marble flooring, integrated smart home automation, modular kitchen with Bosch appliances, and 2 designated covered car parking slots. Located in the elite neighbourhood with 24/7 clubhouse access and infinity pool.',
    propertyType: 'Apartment',
    address: '42 Marine Drive Promenade, Flat 1802',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400020',
    rent: 85000,
    securityDeposit: 250000,
    bedrooms: 3,
    bathrooms: 3,
    area: 2150,
    furnishingStatus: 'Fully-Furnished',
    amenities: ['Swimming Pool', 'Gym', 'Covered Parking', '24/7 Security', 'Elevator', 'Power Backup', 'Air Conditioning', 'Clubhouse', 'Wi-Fi'],
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    ],
    availabilityStatus: 'available',
    approvalStatus: 'approved',
    featured: true,
  },
  {
    title: 'Modern 2BHK Tech Park Residence',
    description: 'Spacious and breezy 2BHK flat adjacent to Manyata Tech Park. Modern aesthetic with customized wardrobes, false ceiling with ambient LED lighting, chimney & RO water purifier installed, dedicated work-from-home desk area, and high-speed fiber internet provision.',
    propertyType: 'Apartment',
    address: 'Tower B - 604, Prestige Misty Waters, Hebbal',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560032',
    rent: 36000,
    securityDeposit: 120000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1320,
    furnishingStatus: 'Semi-Furnished',
    amenities: ['Gym', 'Elevator', 'Power Backup', 'Gated Community', 'Play Area', 'Covered Parking', 'CCTV'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    ],
    availabilityStatus: 'available',
    approvalStatus: 'approved',
    featured: true,
  },
  {
    title: 'Serene 4BHK Gated Villa with Private Garden',
    description: 'Exquisite independent duplex villa nestled in Jubilee Hills. Features landscaped private lawn, modular bar counter, home theater room, servant quarters with private restroom, solar water heating, and 3-car garage. Perfect for executives and families looking for quiet elegance.',
    propertyType: 'Villa',
    address: 'Plot 18, Road No. 36, Jubilee Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500033',
    rent: 110000,
    securityDeposit: 330000,
    bedrooms: 4,
    bathrooms: 5,
    area: 3800,
    furnishingStatus: 'Fully-Furnished',
    amenities: ['Private Garden', 'Swimming Pool', 'Security', 'Pet Friendly', 'Power Backup', 'Balcony', 'Air Conditioning', 'Covered Parking'],
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    ],
    availabilityStatus: 'available',
    approvalStatus: 'approved',
    featured: true,
  },
  {
    title: 'Cozy Designer Studio Apartment in Koregaon Park',
    description: 'Chic urban studio apartment designed with Scandinavian minimalism. Features space-saving Murphy queen bed, compact kitchenette with induction cooktop & microwave, ergonomic work station, and floor-to-ceiling glass balcony with lush tree-top greenery.',
    propertyType: 'Studio',
    address: 'Lane 7, South Main Road, Koregaon Park',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411001',
    rent: 22000,
    securityDeposit: 50000,
    bedrooms: 1,
    bathrooms: 1,
    area: 580,
    furnishingStatus: 'Fully-Furnished',
    amenities: ['Air Conditioning', 'Wi-Fi', 'Elevator', '24/7 Security', 'Balcony', 'Washing Machine'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502005229762-ee152da92e06?auto=format&fit=crop&w=1200&q=80',
    ],
    availabilityStatus: 'available',
    approvalStatus: 'approved',
    featured: false,
  },
  {
    title: 'Spacious 3BHK Independent Floor near Metro',
    description: 'Second-floor builder floor with private key-elevator access in Greater Kailash 1. East-facing with abundant natural light, Italian modular fittings, separate drawing and dining area, master bedroom with walk-in closet, and 100% power backup.',
    propertyType: 'House',
    address: 'M-Block, Greater Kailash 1',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110048',
    rent: 65000,
    securityDeposit: 150000,
    bedrooms: 3,
    bathrooms: 3,
    area: 1850,
    furnishingStatus: 'Semi-Furnished',
    amenities: ['Elevator', 'Power Backup', 'Balcony', 'Covered Parking', '24/7 Security', 'Air Conditioning'],
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
    ],
    availabilityStatus: 'available',
    approvalStatus: 'approved',
    featured: false,
  },
  {
    title: 'Premium 2BHK Coastal View Apartment in OMR',
    description: 'Well-ventilated sea-facing 2BHK flat along the IT corridor in OMR. Located in a high-rise gated society with seaside walking trail, supermarket, multi-cuisine cafe, and tennis court inside the campus. Close to all prominent software parks.',
    propertyType: 'Apartment',
    address: 'Tower 4, Hiranandani Upscale, Navalur, OMR',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '603103',
    rent: 28000,
    securityDeposit: 100000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1240,
    furnishingStatus: 'Fully-Furnished',
    amenities: ['Swimming Pool', 'Gym', 'Clubhouse', 'Play Area', 'Power Backup', 'Covered Parking'],
    images: [
      'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
    ],
    availabilityStatus: 'available',
    approvalStatus: 'approved',
    featured: true,
  },
  {
    title: 'Luxury 3BHK Golf Course Road Condominium',
    description: 'High-end 3BHK flat overlooking DLF Golf Course. Centrally air conditioned, hardwood flooring, quartz countertops, sound-insulated double-glazed windows, and access to premium 5-star club facilities.',
    propertyType: 'Apartment',
    address: 'The Crest, Sector 54, Golf Course Road',
    city: 'Gurgaon',
    state: 'Haryana',
    pincode: '122002',
    rent: 95000,
    securityDeposit: 250000,
    bedrooms: 3,
    bathrooms: 3,
    area: 2400,
    furnishingStatus: 'Fully-Furnished',
    amenities: ['Gym', 'Swimming Pool', 'Clubhouse', 'Concierge', '24/7 Security', 'Elevator', 'Power Backup'],
    images: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    ],
    availabilityStatus: 'available',
    approvalStatus: 'approved',
    featured: false,
  },
  {
    title: 'Comfortable 1BHK Executive Flat in Hitec City',
    description: 'Ideal 1BHK for working professionals. Located walking distance from Cyber Towers and Mindspace IT park. Fully furnished with double bed, LG Smart TV, refrigerator, washing machine, and high-speed Wi-Fi included.',
    propertyType: 'Apartment',
    address: 'Green Meadows, Madhapur, Hitec City',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500081',
    rent: 24000,
    securityDeposit: 60000,
    bedrooms: 1,
    bathrooms: 1,
    area: 750,
    furnishingStatus: 'Fully-Furnished',
    amenities: ['Wi-Fi', 'Air Conditioning', 'Elevator', '24/7 Security', 'Power Backup', 'Covered Parking'],
    images: [
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    ],
    availabilityStatus: 'available',
    approvalStatus: 'approved',
    featured: false,
  },
  {
    title: 'Brand New 3BHK Eco-Friendly Villa in Sarjapur',
    description: 'Eco-conscious green villa with solar power system, rainwater harvesting, organic kitchen garden, high vaulted ceilings, and clubhouse with badminton & squash courts. Peaceful community living.',
    propertyType: 'Villa',
    address: 'Villa 45, Total Environment Windmills, Sarjapur Road',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '562125',
    rent: 70000,
    securityDeposit: 200000,
    bedrooms: 3,
    bathrooms: 3,
    area: 2600,
    furnishingStatus: 'Semi-Furnished',
    amenities: ['Private Garden', 'Clubhouse', 'Gym', 'Swimming Pool', 'Solar Energy', 'Pet Friendly', 'Security'],
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80',
    ],
    availabilityStatus: 'available',
    approvalStatus: 'pending', // Under review demo
    featured: false,
  },
  {
    title: 'Premium Co-Living Studio Room with Food & Housekeeping',
    description: 'Fully serviced private room in luxury co-living property. Includes 3 buffet meals daily, bi-weekly housekeeping, laundry service, dedicated desk, gaming lounge, and community networking events.',
    propertyType: 'PG',
    address: 'UrbanStay Co-living, BTM Layout 2nd Stage',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560076',
    rent: 16500,
    securityDeposit: 30000,
    bedrooms: 1,
    bathrooms: 1,
    area: 320,
    furnishingStatus: 'Fully-Furnished',
    amenities: ['Wi-Fi', 'Air Conditioning', 'Food Included', 'Housekeeping', 'Laundry', 'Gaming Zone', 'Power Backup'],
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
    ],
    availabilityStatus: 'available',
    approvalStatus: 'approved',
    featured: false,
  },
];

const seedDatabase = async () => {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected. Clearing existing collections...');

    await Promise.all([
      User.deleteMany({}),
      Property.deleteMany({}),
      Application.deleteMany({}),
      Agreement.deleteMany({}),
      Rent.deleteMany({}),
      Payment.deleteMany({}),
      Maintenance.deleteMany({}),
      Notification.deleteMany({}),
      Complaint.deleteMany({}),
      AuditLog.deleteMany({}),
      Favorite.deleteMany({}),
    ]);

    console.log('🌱 Seeding Platform Users...');

    // 1 Admin
    const admin = await User.create({
      name: 'Alexander Pierce (Platform Admin)',
      email: 'admin@rentalsystem.com',
      phone: '+91 9876543210',
      password: 'Password123!',
      role: 'admin',
      isVerified: true,
      isActive: true,
      bio: 'Head of Operations & Trust & Safety for UrbanNest Rental Platform.',
      address: 'Corporate Tower A, Bandra Kurla Complex, Mumbai',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    });

    // 3 Owners
    const owner1 = await User.create({
      name: 'Vikram Malhotra',
      email: 'owner1@rentalsystem.com',
      phone: '+91 9822011223',
      password: 'Password123!',
      role: 'owner',
      isVerified: true,
      isActive: true,
      bio: 'Real estate investor with high-end residential apartments across Mumbai and Pune.',
      address: 'Altamount Road, South Mumbai',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    });

    const owner2 = await User.create({
      name: 'Ananya Sharma',
      email: 'owner2@rentalsystem.com',
      phone: '+91 9845012345',
      password: 'Password123!',
      role: 'owner',
      isVerified: true,
      isActive: true,
      bio: 'Property owner managing modern villas and tech apartments in Bangalore and Hyderabad.',
      address: 'Indiranagar 100ft Road, Bangalore',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    });

    const owner3 = await User.create({
      name: 'Rajesh Singhania',
      email: 'owner3@rentalsystem.com',
      phone: '+91 9811054321',
      password: 'Password123!',
      role: 'owner',
      isVerified: true,
      isActive: true,
      bio: 'Owner of premium builder floors and independent residences in Delhi NCR.',
      address: 'Golf Links, New Delhi',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    });

    // 5 Tenants
    const tenant1 = await User.create({
      name: 'Rahul Verma',
      email: 'tenant1@rentalsystem.com',
      phone: '+91 9988776655',
      password: 'Password123!',
      role: 'tenant',
      isVerified: true,
      isActive: true,
      bio: 'Lead Software Architect at an international fintech firm.',
      address: 'Koramangala 4th Block, Bangalore',
      profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    });

    const tenant2 = await User.create({
      name: 'Priya Nambiar',
      email: 'tenant2@rentalsystem.com',
      phone: '+91 9871122334',
      password: 'Password123!',
      role: 'tenant',
      isVerified: true,
      isActive: true,
      bio: 'Senior UX Product Designer working remotely.',
      address: 'Bandra West, Mumbai',
      profileImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    });

    const tenant3 = await User.create({
      name: 'Amit Deshmukh',
      email: 'tenant3@rentalsystem.com',
      phone: '+91 9765432109',
      password: 'Password123!',
      role: 'tenant',
      isVerified: true,
      isActive: true,
      bio: 'Consultant at a global management advisory firm.',
      address: 'Viman Nagar, Pune',
      profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    });

    const tenant4 = await User.create({
      name: 'Sneha Roy',
      email: 'tenant4@rentalsystem.com',
      phone: '+91 9830099887',
      password: 'Password123!',
      role: 'tenant',
      isVerified: true,
      isActive: true,
      bio: 'Data Science Researcher & Tech Enthusiast.',
      address: 'HSR Layout, Bangalore',
      profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    });

    const tenant5 = await User.create({
      name: 'Karthik Sundaram',
      email: 'tenant5@rentalsystem.com',
      phone: '+91 9444012345',
      password: 'Password123!',
      role: 'tenant',
      isVerified: true,
      isActive: true,
      bio: 'Cloud Infrastructure Engineer.',
      address: 'Adyar, Chennai',
      profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    });

    console.log('🏠 Seeding Properties...');
    const ownersList = [owner1, owner2, owner3];
    const createdProperties = [];

    for (let i = 0; i < sampleProperties.length; i++) {
      const propOwner = ownersList[i % ownersList.length];
      const prop = await Property.create({
        ...sampleProperties[i],
        owner: propOwner._id,
      });
      createdProperties.push(prop);
    }

    console.log('📑 Seeding Rental Applications...');
    // Application 1: Rahul applied for Skyline Luxury 3BHK (Approved)
    const app1 = await Application.create({
      tenant: tenant1._id,
      property: createdProperties[0]._id,
      owner: createdProperties[0].owner,
      moveInDate: new Date(2026, 9, 1),
      employmentStatus: 'Employed',
      monthlyIncome: 250000,
      numberOfOccupants: 2,
      message: 'Looking for a long term 2-year lease. Excellent credit score and references available.',
      documents: [
        { name: 'Aadhaar Card / ID Proof', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80', fileType: 'image', status: 'verified' },
        { name: 'Salary Slip 3 Months', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80', fileType: 'image', status: 'verified' },
      ],
      status: 'approved',
      ownerNotes: 'Verified employment and bank records. High reliability tenant.',
    });

    // Application 2: Priya applied for Bangalore Tech Park 2BHK (Under Review)
    const app2 = await Application.create({
      tenant: tenant2._id,
      property: createdProperties[1]._id,
      owner: createdProperties[1].owner,
      moveInDate: new Date(2026, 10, 15),
      employmentStatus: 'Self-Employed',
      monthlyIncome: 140000,
      numberOfOccupants: 1,
      message: 'Quiet UX designer working from home. Will take great care of the apartment.',
      documents: [
        { name: 'Passport ID', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80', fileType: 'image', status: 'pending' },
      ],
      status: 'under_review',
    });

    // Application 3: Amit applied for Koregaon Park Studio (Pending)
    const app3 = await Application.create({
      tenant: tenant3._id,
      property: createdProperties[3]._id,
      owner: createdProperties[3].owner,
      moveInDate: new Date(2026, 10, 1),
      employmentStatus: 'Employed',
      monthlyIncome: 95000,
      numberOfOccupants: 1,
      message: 'Excited about the location. Requesting a 12-month initial term.',
      documents: [],
      status: 'pending',
    });

    console.log('📜 Seeding Rental Agreement...');
    // Agreement for Rahul on Property 0
    const agreement1 = await Agreement.create({
      agreementNumber: 'AGR-2026-88492',
      owner: createdProperties[0].owner,
      tenant: tenant1._id,
      property: createdProperties[0]._id,
      application: app1._id,
      startDate: new Date(2026, 0, 1),
      endDate: new Date(2026, 11, 31),
      monthlyRent: createdProperties[0].rent,
      securityDeposit: createdProperties[0].securityDeposit,
      dueDate: 5,
      terms: '1. Monthly rent of ₹85,000 shall be paid on or before the 5th of each calendar month.\n2. Security deposit of ₹2,50,000 is refundable upon termination and inspection.\n3. The Tenant shall maintain the penthouse and high-end fittings with utmost care.\n4. Notice period of 2 months applies to either party before early termination.\n5. Platform-generated standard agreement subject to Indian Tenancy Laws.',
      status: 'active',
      ownerSignature: {
        signed: true,
        signedAt: new Date(2026, 0, 1),
        signedBy: 'Vikram Malhotra',
      },
      tenantSignature: {
        signed: true,
        signedAt: new Date(2026, 0, 2),
        signedBy: 'Rahul Verma',
      },
    });

    // Update property 0 availability to rented
    createdProperties[0].availabilityStatus = 'rented';
    await createdProperties[0].save();

    console.log('💳 Seeding Rent Billing & Payments...');
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October'];
    for (let m = 0; m < months.length; m++) {
      const isPaid = m < 8; // Jan to Aug are paid
      const isOverdue = m === 8; // Sept overdue
      const isPending = m === 9; // Oct pending

      const dueDate = new Date(2026, m, 5);
      const rentRec = await Rent.create({
        agreement: agreement1._id,
        property: createdProperties[0]._id,
        tenant: tenant1._id,
        owner: createdProperties[0].owner,
        month: months[m],
        year: 2026,
        amount: 85000,
        dueDate,
        status: isPaid ? 'paid' : (isOverdue ? 'overdue' : 'pending'),
        paidDate: isPaid ? new Date(2026, m, 4) : null,
        lateFee: isOverdue ? 1500 : 0,
      });

      if (isPaid) {
        await Payment.create({
          rentRecord: rentRec._id,
          agreement: agreement1._id,
          property: createdProperties[0]._id,
          tenant: tenant1._id,
          owner: createdProperties[0].owner,
          amount: 85000,
          paymentDate: new Date(2026, m, 4),
          paymentMethod: m % 2 === 0 ? 'UPI' : 'Bank Transfer',
          transactionReference: `TXN-20260${m+1}-MUM${Math.floor(1000 + Math.random()*9000)}`,
          status: 'completed',
          notes: `Monthly rental payment for ${months[m]} 2026 via UrbanNest Gateway`,
        });
      }
    }

    console.log('🛠️ Seeding Maintenance Tickets...');
    await Maintenance.create({
      ticketNumber: 'MNT-48291',
      tenant: tenant1._id,
      property: createdProperties[0]._id,
      owner: createdProperties[0].owner,
      title: 'Balcony Jacuzzi Jet Pressure Low',
      description: 'The hydromassage jets in the balcony tub are not building full pressure since yesterday. Please send an authorized technician.',
      category: 'Plumbing',
      priority: 'Medium',
      status: 'In Progress',
      estimatedCost: 3500,
      actualCost: 0,
      ownerNotes: 'Plumber scheduled for tomorrow morning 11 AM.',
    });

    await Maintenance.create({
      ticketNumber: 'MNT-19382',
      tenant: tenant1._id,
      property: createdProperties[0]._id,
      owner: createdProperties[0].owner,
      title: 'Master Bedroom AC Servicing',
      description: 'Scheduled semi-annual cleaning and refrigerant check for Daikin inverter AC.',
      category: 'Appliance',
      priority: 'Low',
      status: 'Resolved',
      estimatedCost: 2000,
      actualCost: 1800,
      ownerNotes: 'Filter cleaned and gas refilled. Completed.',
      resolvedAt: new Date(2026, 7, 20),
    });

    console.log('🔔 Seeding Notifications & Audit Logs...');
    await Notification.create({
      recipient: admin._id,
      sender: owner1._id,
      title: 'New Property Submitted for Review',
      message: 'Owner Vikram Malhotra listed "Skyline Luxury 3BHK Penthouse" in Mumbai.',
      type: 'property',
    });

    await Notification.create({
      recipient: tenant1._id,
      sender: owner1._id,
      title: 'Lease Agreement Active! 🏡',
      message: 'Your rental agreement for Skyline Luxury 3BHK Penthouse is fully executed.',
      type: 'agreement',
    });

    await Notification.create({
      recipient: tenant1._id,
      sender: null,
      title: 'Rent Reminder - October 2026',
      message: 'Your monthly rent of ₹85,000 is due on 5th October.',
      type: 'rent',
    });

    await Complaint.create({
      ticketId: 'CMP-77412',
      user: tenant2._id,
      againstUser: owner2._id,
      property: createdProperties[1]._id,
      title: 'Clarification regarding parking allocation clause',
      description: 'Need platform assistance on whether covered basement parking is inclusive in listed rent.',
      category: 'Property Issue',
      status: 'investigating',
      adminNotes: 'Admin team in contact with Owner Ananya to update listing metadata.',
    });

    await AuditLog.create({
      user: admin._id,
      userName: admin.name,
      userRole: 'admin',
      action: 'SYSTEM_INITIALIZATION',
      entity: 'Platform',
      description: 'Database initialized with full SaaS seed dataset across all roles.',
    });

    await Favorite.create({
      tenant: tenant1._id,
      property: createdProperties[1]._id,
    });
    await Favorite.create({
      tenant: tenant1._id,
      property: createdProperties[2]._id,
    });

    console.log('====================================================');
    console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY! 🎉');
    console.log('====================================================');
    console.log('Demo Credentials:');
    console.log('🔑 Admin:  admin@rentalsystem.com   / Password123!');
    console.log('🔑 Owner:  owner1@rentalsystem.com  / Password123!');
    console.log('🔑 Tenant: tenant1@rentalsystem.com / Password123!');
    console.log('====================================================');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedDatabase();
