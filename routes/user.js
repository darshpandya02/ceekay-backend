// routes/user.js
const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');

const router = express.Router();

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const { name, phone, companyName } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, companyName },
      { new: true, runValidators: true }
    );

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user addresses
router.get('/addresses', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add user address
router.post('/addresses', async (req, res) => {
  try {
    const { street, city, state, zipCode, country, isDefault } = req.body;

    const user = await User.findById(req.user._id);

    // If this is set as default, remove default from other addresses
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push({
      street,
      city,
      state,
      zipCode,
      country: country || 'India',
      isDefault: isDefault || false
    });

    await user.save();

    res.status(201).json(user.addresses[user.addresses.length - 1]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update user address
router.put('/addresses/:addressId', async (req, res) => {
  try {
    const { street, city, state, zipCode, country, isDefault } = req.body;

    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.addressId);

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // If this is set as default, remove default from other addresses
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    address.street = street || address.street;
    address.city = city || address.city;
    address.state = state || address.state;
    address.zipCode = zipCode || address.zipCode;
    address.country = country || address.country;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

    await user.save();

    res.json(address);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete user address
router.delete('/addresses/:addressId', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses.id(req.params.addressId).remove();
    await user.save();

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user wishlist
router.get('/wishlist', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add to wishlist
router.post('/wishlist/add', async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.user._id);
    
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    res.json({ message: 'Product added to wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove from wishlist
router.delete('/wishlist/remove', async (req, res) => {
  try {
    const { productId } = req.body;

    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();

    res.json({ message: 'Product removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;