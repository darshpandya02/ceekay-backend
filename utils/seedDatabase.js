// utils/seedDatabase.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ceekay-db');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();
    console.log('Admin user created');

    // Create sample products
    const sampleProducts = [
      {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 2999,
        originalPrice: 3999,
        category: 'Electronics',
        subcategory: 'Audio',
        brand: 'TechBrand',
        images: ['https://via.placeholder.com/400x400?text=Headphones'],
        stock: 50,
        sku: 'WH001',
        isPromoted: true,
        tags: ['wireless', 'headphones', 'audio']
      },
      {
        name: 'Smartphone',
        description: 'Latest smartphone with advanced features',
        price: 24999,
        originalPrice: 29999,
        category: 'Electronics',
        subcategory: 'Mobile',
        brand: 'TechBrand',
        images: ['https://via.placeholder.com/400x400?text=Smartphone'],
        stock: 30,
        sku: 'SP001',
        isPromoted: true,
        tags: ['smartphone', 'mobile', 'technology']
      },
      {
        name: 'Laptop Bag',
        description: 'Durable laptop bag for professionals',
        price: 1499,
        originalPrice: 1999,
        category: 'Accessories',
        subcategory: 'Bags',
        brand: 'BagBrand',
        images: ['https://via.placeholder.com/400x400?text=Laptop+Bag'],
        stock: 25,
        sku: 'LB001',
        tags: ['laptop', 'bag', 'professional']
      },
      {
        name: 'Coffee Maker',
        description: 'Automatic coffee maker for home use',
        price: 5999,
        originalPrice: 7999,
        category: 'Home & Kitchen',
        subcategory: 'Appliances',
        brand: 'HomeBrand',
        images: ['https://via.placeholder.com/400x400?text=Coffee+Maker'],
        stock: 15,
        sku: 'CM001',
        tags: ['coffee', 'maker', 'kitchen']
      },
      {
        name: 'Running Shoes',
        description: 'Comfortable running shoes for athletes',
        price: 3999,
        originalPrice: 5999,
        category: 'Sports',
        subcategory: 'Footwear',
        brand: 'SportsBrand',
        images: ['https://via.placeholder.com/400x400?text=Running+Shoes'],
        stock: 40,
        sku: 'RS001',
        tags: ['running', 'shoes', 'sports']
      }
    ];

    await Product.insertMany(sampleProducts);
    console.log('Sample products created');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();