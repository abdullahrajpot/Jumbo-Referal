const Transaction = require('../models/Transaction');

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
        let level = 2;
        while (parent.referrerId) {
          const parentUser = await User.findById(parent.referrerId);
          if (!parentUser) break;
          const parentBonus = amount * 0.02;
          parentUser.wallet += parentBonus;
          totalBonus += parentBonus;
          await parentUser.save();
          parent = parentUser;
          level++;
        }
      }
    }

    // Add deposit to user, then deduct total bonuses
    user.wallet += amount - totalBonus;
    user.totalDeposits += amount;
    await user.save();

    // Create a transaction record
    await Transaction.create({
      userId: user._id,
      amount,
      commission: totalBonus,
      netAmount: amount - totalBonus,
      method,
      date: new Date(),
      transactionId,
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

// Fetch all transactions for a user
router.get('/user/:id/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.id }).sort({ date: 1 });
    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
}); 