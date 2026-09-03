const mongoose = require('mongoose');

const failedPaymentSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  method: { type: String, required: true },
  failureReason: { type: String, required: true },
  status: { type: String, enum: ['Failed', 'Recovered'], default: 'Failed' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FailedPayment', failedPaymentSchema);
