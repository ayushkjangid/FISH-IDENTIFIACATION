import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const fishDetailURI = 'mongodb+srv://ayushjangid:ayushjangid21@cluster0.yxy0vsg.mongodb.net/FISHDETAILS';

const fishDetailDb = mongoose.createConnection(fishDetailURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const fishDetailSchema = new mongoose.Schema({}, { strict: false, collection: 'FISHDETAILSS' });
const FishDetail = fishDetailDb.model('FishDetail', fishDetailSchema);

async function testQuery() {
    try {
        const predictedLabel = "Tilapia";
        let fishDetails = await FishDetail.findOne({ 
          model_label: new RegExp(`^${predictedLabel}$`, 'i') 
        });
        
        if (!fishDetails) {
          fishDetails = await FishDetail.findOne({ 
            name: new RegExp(`^${predictedLabel}$`, 'i') 
          });
        }
        
        console.log("Found:", fishDetails);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

testQuery();
