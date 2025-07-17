const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String },
});

// Virtual for subtotal
orderItemSchema.virtual("subtotal").get(function () {
  return this.price * this.quantity;
});

orderItemSchema.set("toJSON", { virtuals: true });
orderItemSchema.set("toObject", { virtuals: true });

const shippingAddressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true, default: "India" },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderNumber: { type: String, unique: true, required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    subtotal: { type: Number },
    taxAmount: { type: Number, default: 0 },
    shippingAmount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    shippingAddress: { type: shippingAddressSchema, required: true },
    billingAddress: { type: shippingAddressSchema },
    paymentMethod: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    trackingNumber: { type: String },
    estimatedDelivery: { type: Date },
    deliveredAt: { type: Date },
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

// Generate order number before saving
orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    this.orderNumber =
      "ORD-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
  }

  // Calculate subtotal if not provided
  if (!this.subtotal) {
    this.subtotal = this.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  next();
});

module.exports = mongoose.model("Order", orderSchema);
