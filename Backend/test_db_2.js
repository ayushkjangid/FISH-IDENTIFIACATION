import mongoose from 'mongoose';

async function test() {
  const uri = 'mongodb+srv://ayushjangid:ayushjangid21@cluster0.yxy0vsg.mongodb.net/FISHDETAILS';
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log("Collections in FISHDETAILS:", collections.map(c => c.name));
    
    // Test user DB just in case
    const uriUser = 'mongodb+srv://ayushjangid:ayushjangid21@cluster0.yxy0vsg.mongodb.net/user';
    const conn2 = mongoose.createConnection(uriUser, { useNewUrlParser: true, useUnifiedTopology: true });
    
    conn2.on('open', async () => {
        const userCollections = await conn2.db.listCollections().toArray();
        console.log("Collections in user DB:", userCollections.map(c => c.name));
        process.exit(0);
    });

  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

test();
