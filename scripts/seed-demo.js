// scripts/seed-demo.js
// Seeds a self-contained demo database with generic sample products, a demo
// admin and a demo customer. It never runs the production seed and refuses to
// run unless the target database is named explicitly in MONGODB_URI.
//
// Usage:
//   MONGODB_URI="mongodb+srv://.../<demo-db>?..." \
//   DEMO_ADMIN_PASSWORD="<strong password>" \
//   DEMO_CUSTOMER_PASSWORD="<password shown on the login screen>" \
//   node scripts/seed-demo.js
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

const {
  MONGODB_URI,
  DEMO_ADMIN_EMAIL = 'admin@ceekay-demo.example.com',
  DEMO_ADMIN_PASSWORD,
  DEMO_CUSTOMER_EMAIL = 'buyer@ceekay-demo.example.com',
  DEMO_CUSTOMER_PASSWORD,
} = process.env;

const image = (label) =>
  `https://placehold.co/600x400/e8f1ee/1d5c4d?text=${encodeURIComponent(label)}`;

const sampleProducts = [
  {
    name: 'Sodium Bicarbonate 25kg',
    description: 'Food and industrial grade sodium bicarbonate powder, supplied in 25kg bags.',
    price: 32,
    originalPrice: 36,
    category: 'Industrial Chemicals',
    subcategory: 'Carbonates',
    brand: 'Sample Supply Co.',
    stock: 400,
    unit: 'bags',
    sku: 'DEMO-SBC-25',
    isPromoted: true,
    tags: ['bicarbonate', 'powder', 'food grade'],
    specifications: [
      { key: 'Purity', value: '99.5', unit: '%' },
      { key: 'Pack size', value: '25', unit: 'kg' },
    ],
  },
  {
    name: 'Citric Acid Anhydrous',
    description: 'Granular anhydrous citric acid for food, beverage and cleaning formulations.',
    price: 48,
    category: 'Food Grade Additives',
    subcategory: 'Acids',
    brand: 'Sample Supply Co.',
    stock: 250,
    unit: 'bags',
    sku: 'DEMO-CAA-25',
    isPromoted: true,
    tags: ['citric', 'acid', 'granular'],
    specifications: [{ key: 'Purity', value: '99.5', unit: '%' }],
  },
  {
    name: 'Calcium Chloride Flakes 77%',
    description: 'Calcium chloride dihydrate flakes used for de-icing, dust control and brine.',
    price: 27,
    category: 'Industrial Chemicals',
    subcategory: 'Chlorides',
    brand: 'Sample Supply Co.',
    stock: 600,
    unit: 'bags',
    sku: 'DEMO-CCF-77',
    tags: ['chloride', 'flakes'],
  },
  {
    name: 'Aluminium Sulphate (Alum)',
    description: 'Non-ferric aluminium sulphate for municipal and industrial water treatment.',
    price: 22,
    category: 'Water Treatment',
    subcategory: 'Coagulants',
    brand: 'Sample Supply Co.',
    stock: 320,
    unit: 'bags',
    sku: 'DEMO-ALS-50',
    tags: ['alum', 'water treatment'],
  },
  {
    name: 'Sodium Hypochlorite 12%',
    description: 'Liquid sodium hypochlorite solution for disinfection, supplied in 35kg carboys.',
    price: 19,
    category: 'Water Treatment',
    subcategory: 'Disinfectants',
    brand: 'Sample Supply Co.',
    stock: 150,
    unit: 'carboys',
    sku: 'DEMO-SHC-12',
    isHazardous: true,
    storageInstructions: 'Store in a cool, shaded area away from acids.',
    tags: ['hypochlorite', 'liquid', 'disinfectant'],
  },
  {
    name: 'Isopropyl Alcohol 99%',
    description: 'High purity isopropyl alcohol for cleaning, extraction and laboratory use.',
    price: 64,
    category: 'Solvents',
    subcategory: 'Alcohols',
    brand: 'Sample Supply Co.',
    stock: 120,
    unit: 'drums',
    sku: 'DEMO-IPA-99',
    isHazardous: true,
    tags: ['ipa', 'solvent'],
  },
  {
    name: 'Glycerine USP',
    description: 'Refined vegetable glycerine meeting USP grade, for cosmetics and food.',
    price: 55,
    category: 'Food Grade Additives',
    subcategory: 'Polyols',
    brand: 'Sample Supply Co.',
    stock: 90,
    unit: 'drums',
    sku: 'DEMO-GLY-USP',
    tags: ['glycerine', 'glycerol'],
  },
  {
    name: 'Potassium Nitrate Crystals',
    description: 'Technical grade potassium nitrate crystals for fertiliser blending.',
    price: 41,
    category: 'Agro Inputs',
    subcategory: 'Nitrates',
    brand: 'Sample Supply Co.',
    stock: 200,
    unit: 'bags',
    sku: 'DEMO-PNC-25',
    tags: ['nitrate', 'fertiliser'],
  },
].map((p) => ({ ...p, images: [image(p.name)] }));

const upsertUser = async ({ email, password, ...fields }) => {
  let user = await User.findOne({ email });
  if (!user) user = new User({ email, password, ...fields });
  Object.assign(user, fields, { password, isActive: true });
  await user.save();
  return user;
};

const run = async () => {
  if (!MONGODB_URI) throw new Error('MONGODB_URI is required');
  if (!DEMO_ADMIN_PASSWORD || DEMO_ADMIN_PASSWORD.length < 12) {
    throw new Error('DEMO_ADMIN_PASSWORD is required (at least 12 characters)');
  }
  if (!DEMO_CUSTOMER_PASSWORD) throw new Error('DEMO_CUSTOMER_PASSWORD is required');

  await mongoose.connect(MONGODB_URI);
  const dbName = mongoose.connection.db.databaseName;
  if (!dbName || dbName === 'test' || dbName === 'admin') {
    throw new Error(`Refusing to seed database "${dbName}". Put the demo database name in the URI path.`);
  }
  console.log(`Seeding demo data into database "${dbName}"`);

  await Promise.all([Product.deleteMany({}), Order.deleteMany({}), Cart.deleteMany({})]);
  await User.deleteMany({ email: { $nin: [DEMO_ADMIN_EMAIL, DEMO_CUSTOMER_EMAIL] } });

  await Product.insertMany(sampleProducts);
  console.log(`Inserted ${sampleProducts.length} sample products`);

  await upsertUser({
    name: 'Demo Admin',
    email: DEMO_ADMIN_EMAIL,
    password: DEMO_ADMIN_PASSWORD,
    role: 'admin',
  });
  await upsertUser({
    name: 'Demo Buyer',
    email: DEMO_CUSTOMER_EMAIL,
    password: DEMO_CUSTOMER_PASSWORD,
    companyName: 'Sample Manufacturing Ltd',
    role: 'user',
    addresses: [
      {
        street: '123 Market St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'USA',
        isDefault: true,
      },
    ],
  });
  console.log(`Demo admin: ${DEMO_ADMIN_EMAIL}`);
  console.log(`Demo customer: ${DEMO_CUSTOMER_EMAIL}`);
};

run()
  .then(() => mongoose.disconnect())
  .catch(async (err) => {
    console.error('Demo seed failed:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  });
