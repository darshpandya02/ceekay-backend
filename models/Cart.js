const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  price: { type: Number, required: true },
  addedAt: { type: Date, default: Date.now },
});

// Virtual for subtotal
cartItemSchema.virtual("subtotal").get(function () {
  return this.price * this.quantity;
});

cartItemSchema.set("toJSON", { virtuals: true });
cartItemSchema.set("toObject", { virtuals: true });

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [cartItemSchema],
    totalAmount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Virtual for totalItems
cartSchema.virtual("totalItems").get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

cartSchema.set("toJSON", { virtuals: true });
cartSchema.set("toObject", { virtuals: true });

// Calculate total amount before saving
cartSchema.pre("save", function (next) {
  this.totalAmount = this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  next();
});

module.exports = mongoose.model("Cart", cartSchema);
