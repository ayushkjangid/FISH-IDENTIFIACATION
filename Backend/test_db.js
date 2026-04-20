import mongoose from 'mongoose';

async function test() {
  const uri = 'mongodb+srv://ayushjangid:ayushjangid21@cluster0.yxy0vsg.mongodb.net/FISHDETAILS';
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection.db;
    const collection = db.collection('fishclientdetail');
    const doc = await collection.findOne({});
    console.log("Sample Document:", doc);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

test();
