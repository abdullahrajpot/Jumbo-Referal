const User = require('../models/User');

// ⬇️ Add this to walk UP the referrer chain
async function findTopReferrer(user) {
  let current = user;
  while (current.referrerId) {
    const referrer = await User.findById(current.referrerId);
    if (!referrer) break;
    current = referrer;
  }
  return current;
}

async function buildMLMTree(userId, level = 0) {
  const user = await User.findById(userId).populate('referredUsers', 'name email referralCode');
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    level,
    children: await Promise.all(
      user.referredUsers.map(child => buildMLMTree(child.id, level + 1))
    ),
  };
}

async function buildFullMLMTreeFromAnyUser(userId) {
  const user = await User.findById(userId);
  if (!user) return null;
  const topReferrer = await findTopReferrer(user);
  return buildMLMTree(topReferrer.id);
}

module.exports = { buildFullMLMTreeFromAnyUser, buildMLMTree };
