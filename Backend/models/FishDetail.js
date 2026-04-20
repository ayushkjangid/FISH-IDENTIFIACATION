import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const fishDetailURI = process.env.MONGO_URI ? process.env.MONGO_URI.replace('/user', '/FISHDETAILS') : 'mongodb+srv://ayushjangid:ayushjangid21@cluster0.yxy0vsg.mongodb.net/FISHDETAILS';

const fishDetailDb = mongoose.createConnection(fishDetailURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

fishDetailDb.on('connected', () => {
  console.log(`✅ Connected to MongoDB: FISHDETAILS (Worker ${process.pid})`);
});

fishDetailDb.on('error', (err) => {
  console.error("❌ MongoDB FISHDETAILS connection error:", err);
});

const fishDetailSchema = new mongoose.Schema({}, { strict: false, collection: 'FISHDETAILSS' });

const FishDetail = fishDetailDb.model('FishDetail', fishDetailSchema);

export default FishDetail;
