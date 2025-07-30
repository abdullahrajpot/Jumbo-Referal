// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

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
// routes/userRoutes.js
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
    console.error(error); // Add this for debugging
    res.status(500).json({ error: 'Failed to update profile' });
  }

});
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
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


module.exports = router;
