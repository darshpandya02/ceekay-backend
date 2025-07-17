const mongoose = require("mongoose");

const specificationSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true },
  unit: { type: String },
});

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema(
  {
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
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 },
    },
    minOrderQuantity: { type: Number, min: 1, default: 1 },
    maxOrderQuantity: { type: Number, min: 1 },
    unit: { type: String, default: "pieces" },
    isActive: { type: Boolean, default: true },
    isPromoted: { type: Boolean, default: false },
    promotedUntil: { type: Date },
    isHazardous: { type: Boolean, default: false },
    storageInstructions: { type: String },
    applicationInstructions: { type: String },
    tags: [{ type: String }],
    specifications: [specificationSchema],
    reviews: [reviewSchema],
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Virtual for inStock based on stock quantity
productSchema.virtual("inStock").get(function () {
  return this.stock > 0;
});

// Virtual for discount calculation
productSchema.virtual("discount").get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100
    );
  }
  return 0;
});

// Virtual for thumbnail (first image)
productSchema.virtual("thumbnail").get(function () {
  return this.images && this.images.length > 0 ? this.images[0] : null;
});

// Virtual for rating (alias for averageRating)
productSchema.virtual("rating").get(function () {
  return this.averageRating;
});

// Virtual for reviewCount (alias for totalReviews)
productSchema.virtual("reviewCount").get(function () {
  return this.totalReviews;
});

// Ensure virtual fields are serialized
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

// Index for search
productSchema.index({ name: "text", description: "text", category: "text" });

// Update averageRating and totalReviews when reviews change
productSchema.pre("save", function (next) {
  if (this.reviews && this.reviews.length > 0) {
    this.totalReviews = this.reviews.length;
    this.averageRating =
      this.reviews.reduce((sum, review) => sum + review.rating, 0) /
      this.reviews.length;
  } else {
    this.totalReviews = 0;
    this.averageRating = 0;
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
