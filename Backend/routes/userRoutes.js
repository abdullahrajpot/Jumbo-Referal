// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  setup2FA, 
  enable2FA, 
  disable2FA, 
  generateBackupCodes 
} = require('../controllers/userController');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Existing routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Count all users
router.get('/count', async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user count' });
  }
});

// Update user profile
router.put('/update/:id', async (req, res) => {
  try {
    const updateFields = {};
    if (req.body.name !== undefined) updateFields.name = req.body.name;
    if (req.body.referralCode !== undefined) updateFields.referralCode = req.body.referralCode;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user by ID
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
        twoFactorEnabled: user.twoFactorEnabled,
        wallet: user.wallet,
        totalDeposits: user.totalDeposits
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// Get all transactions for a user
router.get('/user/:id/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.id }).sort({ date: -1 });
    res.json({ transactions });
  } catch (error) {
    console.error('Fetch transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// 2FA Routes
router.post('/2fa/setup/:userId', setup2FA);
router.post('/2fa/enable/:userId', enable2FA);
router.post('/2fa/disable/:userId', disable2FA);
router.post('/2fa/backup-codes/:userId', generateBackupCodes);

// Test route
router.get('/2fa/test', (req, res) => {
  res.json({ message: '2FA routes are working' });
});
module.exports = router;