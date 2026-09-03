const mongoose = require('mongoose');

const recoveryActionSchema = new mongoose.Schema({
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'FailedPayment', required: true },
  actionType: { type: String, required: true }, // e.g., 'Email Sent', 'WhatsApp Sent'
  status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('RecoveryAction', recoveryActionSchema);
