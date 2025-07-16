
// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  category: { type: String, required: true, trim: true },
  subcategory: { type: String, trim: true },
  brand: { type: String, trim: true },
  images: [{ type: String }],
  stock: { type: Number, required: true, min: 0, default: 0 },
  sku: { type: String, unique: true, required: true },
  weight: { type: Number, min: 0 },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  isActive: { type: Boolean, default: true },
  isPromoted: { type: Boolean, default: false },
  promotedUntil: { type: Date },
  tags: [String],
  specifications: [{
    key: String,
    value: String
  }],
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Index for search
productSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
