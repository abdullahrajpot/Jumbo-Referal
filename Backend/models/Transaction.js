const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  commission: { type: Number, required: true },
  netAmount: { type: Number, required: true },
  method: { type: String },
  date: { type: Date, default: Date.now },
  transactionId: { type: String }, // optional, for reference
  // Add more fields as needed (status, notes, etc.)
});

module.exports = mongoose.model('Transaction', transactionSchema); 