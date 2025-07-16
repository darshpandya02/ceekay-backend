// utils/seedDatabase.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Product = require("../models/Product");
require("dotenv").config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/ceekay-db"
    );
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log("Cleared existing data");

    // Create admin user
    const adminUser = new User({
      name: "Admin",
      email: "admin@gmail.com",
      password: "admin123",
      role: "admin",
    });
    await adminUser.save();
    console.log("Admin user created");

    // Create sample products
    const sampleProducts = [
      {
        name: "2 2 Dichlorodiethyl Ether (DCEE)",
        description: "High-quality Dichlorodiethyl Ether (DCEE)",
        price: 100,
        originalPrice: 100,
        category: "Agrochemicals",
        subcategory: "Ethers",
        brand: "Ceekay",
        images: [
          "https://img2.exportersindia.com/product_images/bc-full/2019/4/818714/2-2-dichlorodiethyl-ether-dcee-1555582590-4861071.jpeg",
        ],
        stock: 50,
        sku: "WH001",
        isPromoted: true,
        tags: ["ether", "agrochemicals", "liquid"],
      },
      {
        name: "Sodium Sulphide Yellow Flakes 60% 30ppm",
        description:
          "We are a self importer of High Quality Sodium Sulphide Yellow Flakes  60% 30ppm from China .",
        price: 45,
        originalPrice: 45,
        category: "Agrochemicals",
        subcategory: "Sulphides",
        brand: "Ceekay",
        images: [
          "https://img2.exportersindia.com/product_images/bc-full/2019/5/818714/sodium-sulphide-yellow-flakes-60-30ppm-1558351656-4915717.jpeg",
        ],
        stock: 30,
        sku: "SP001",
        isPromoted: true,
        tags: ["sulphides", "agrochemicals", "flakes"],
      },
      {
        name: "Potassium Bicarbonate",
        description: "High Quality Potassium Bicarbonate",
        price: 80,
        originalPrice: 80,
        category: "Agrochemicals",
        subcategory: "Carbonates",
        brand: "Ceekay",
        images: [
          "https://img2.exportersindia.com/product_images/bc-full/dir_28/818714/potassium-bicarbonate-811414.jpg",
        ],
        stock: 25,
        sku: "LB001",
        tags: ["carbonates", "agrochemicals", "powder"],
      },
      {
        name: "Phosphoric Acid",
        description:
          "Ortho Phosphoric Acid 85% water white in color Make Taiwan and VietnamWe are Importer and Stockiest",
        price: 120,
        originalPrice: 120,
        category: "Agrochemicals",
        subcategory: "Acids",
        brand: "Taiwand and Vietnam",
        images: [
          "https://img2.exportersindia.com/product_images/bc-full/2019/4/818714/phosphoric-acid-1555582763-3432652.jpg",
        ],
        stock: 15,
        sku: "CM001",
        tags: ["acids", "agrochemicals", "liquid"],
      },
      {
        name: "Ammonium Chloride",
        description: "High Quality Ammonium Chloride",
        price: 80,
        originalPrice: 80,
        category: "Agrochemicals",
        subcategory: "Ammonia",
        brand: "Ceekay",
        images: [
          "https://img2.exportersindia.com/product_images/bc-full/dir_28/818714/ammonium-chloride-809416.jpg",
        ],
        stock: 40,
        sku: "RS001",
        tags: ["ammonia", "agrochemicals", "powder"],
      },
    ];

    await Product.insertMany(sampleProducts);
    console.log("Sample products created");

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
