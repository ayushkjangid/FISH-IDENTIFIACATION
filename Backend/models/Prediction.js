import mongoose from 'mongoose';

const PredictionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  filename: String,
  fileUrl: String,
  species: String,
  confidence: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Prediction', PredictionSchema);
