const User = require('../models/User');
const { buildMLMTree } = require('./buildMLMTree');

async function distributeReferralBonus(userId, depositAmount) {
  try {
    // Find the depositing user
    const depositingUser = await User.findById(userId);
    if (!depositingUser) return { payments: [], totalDistributed: 0 };

    // Find the main referrer (whose code was used)
    const mainReferrerId = depositingUser.referrerId;
    if (!mainReferrerId) return { payments: [], totalDistributed: 0 };
    const mainReferrer = await User.findById(mainReferrerId);
    if (!mainReferrer) return { payments: [], totalDistributed: 0 };

    const payments = [];
    let totalDistributed = 0;

    // 1. Give 10% to the main referrer
    const mainBonus = (depositAmount * 10) / 100;
    mainReferrer.wallet += mainBonus;
    await mainReferrer.save();
    payments.push({
      level: 1,
      userId: mainReferrer.id,
      email: mainReferrer.email,
      bonus: mainBonus,
    });
    totalDistributed += mainBonus;

    // 2. Find up to 5 unique children (direct or indirect) of the main referrer, excluding the depositing user
    const mlmTree = await buildMLMTree(mainReferrerId);
    const queue = [...(mlmTree.children || [])];
    const children = [];
    const visited = new Set();
    while (queue.length > 0 && children.length < 5) {
      const node = queue.shift();
      if (!node) continue;
      if (node.id !== userId && !visited.has(node.id)) {
        children.push(node);
        visited.add(node.id);
      }
      if (node.children && node.children.length > 0) {
        queue.push(...node.children);
      }
    }

    // 3. Give 2% to each child
    for (let i = 0; i < children.length; i++) {
      const childUser = await User.findById(children[i].id);
      if (!childUser) continue;
      const bonus = (depositAmount * 2) / 100;
      childUser.wallet += bonus;
      await childUser.save();
      payments.push({
        level: i + 2,
        userId: childUser.id,
        email: childUser.email,
        bonus,
      });
      totalDistributed += bonus;
    }

    return { payments, totalDistributed };
  } catch (err) {
    console.error("Error in distributeReferralBonus (down the tree):", err);
    return { payments: [], totalDistributed: 0 };
  }
}

module.exports = { distributeReferralBonus };
