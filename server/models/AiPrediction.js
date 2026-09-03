const mongoose = require('mongoose');

const aiPredictionSchema = new mongoose.Schema({
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'FailedPayment', required: true },
  recoveryProbability: { type: Number, required: true },
  bestChannel: { type: String, required: true },
  retryTime: { type: String, required: true },
  suggestedMessage: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AiPrediction', aiPredictionSchema);
