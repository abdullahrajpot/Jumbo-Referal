const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');


// routes/userRoutes.js
router.post('/users/deposit/:id', async (req, res) => {
  try {
    const { amount, method, transactionId } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    let totalBonus = 0;

    // Level 1: Direct referrer gets 10%
    if (user.referrerId) {
      const referrer = await User.findById(user.referrerId);
      if (referrer) {
        const bonus = amount * 0.10;
        referrer.wallet += bonus;
        totalBonus += bonus;
        await referrer.save();

        // Level 2+: Each parent gets 2%
        let parent = referrer;
        let parentBonusCount = 0;
        while (parent.referrerId && parentBonusCount < 5) {
          const parentUser = await User.findById(parent.referrerId);
          if (!parentUser) break;
          const parentBonus = amount * 0.02;
          parentUser.wallet += parentBonus;
          totalBonus += parentBonus;
          await parentUser.save();
          parent = parentUser;
          parentBonusCount++;
        }
      }
    }

    // Add deposit to user, then deduct total bonuses
    const netAmount = amount - totalBonus;
    user.wallet += netAmount;
    user.totalDeposits += amount;
    await user.save();

    // Create transaction record
    await Transaction.create({
      userId: user._id,
      amount,
      commission: totalBonus,
      netAmount,
      method,
      transactionId
    });

    res.json({ 
      success: true, 
      message: `Deposit successful. Bonuses distributed: ${totalBonus}`, 
      user,
      totalDistributed: totalBonus // <--- THIS is the transaction fee (commission)
    });
  } catch (error) {
    console.error('Deposit error:', error);
    res.status(500).json({ error: 'Server error during deposit' });
  }
});
module.exports = router;