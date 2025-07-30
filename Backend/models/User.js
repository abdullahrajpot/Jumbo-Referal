const mongoose = require('mongoose');
const { nanoid } = require('nanoid');


const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  referralCode: { type: String, unique: true },
  referrerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default:null },
  referredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  totalDeposits: { type: Number, default: 0 },
  wallet: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', userSchema);
