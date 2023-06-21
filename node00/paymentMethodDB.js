const connection = require('./connectDB')
const { MongoClient , ObjectID, ObjectId} = require('mongodb');

async function insertGateway(gateway) {
    const client = await connection.connectToDatabase();
    const db2=client.db();
    const gatewaysCollection = db2.collection('PaymentMethod');
  
    try {
      const result = await gatewaysCollection.insertOne(gateway);
      const insertedGatewayId = result.insertedId; // Move the declaration and assignment inside the try block
      console.log('Gateway inserted:', insertedGatewayId);
      return insertedGatewayId;
    } catch (error) {
      console.error('Error inserting Gateway:', error);
      throw error;
    }
  }
  


async function updateGateway(gatewayId, updatedGateway) {
    const client = await connection.connectToDatabase();
    const db2=client.db();
    const gatewaysCollection = db2.collection('PaymentMethod');
  
    try {
      const result = await gatewaysCollection.updateOne(
        { _id: new ObjectId(gatewayId) },
        { $set: updatedGateway }
      );
      console.log('Gateway updated:', result.modifiedCount);
      return result.modifiedCount;
    } catch (error) {
      console.error('Error updating Gateway:', error);
    }
}
  
async function deleteGateway(gatewayId) {
    const client = await connection.connectToDatabase();
    const db2=client.db();
    const gatewaysCollection = db2.collection('PaymentMethod');
    
  
    try {
      const result = await gatewaysCollection.deleteOne({ _id: gatewayId });
      console.log('Gateway deleted:', result.deletedCount);
      return result.deletedCount;
    } catch (error) {
      console.error('Error deleting Gateway:', error);
    }
}

async function searchGatewayByname(Gatewayname) {
    const client = await connection.connectToDatabase();
    const db2=client.db();
    const gatewaysCollection = db2.collection('PaymentMethod');
  
    try {
      const gateway = await gatewaysCollection.findOne({ method_name: Gatewayname });
      console.log('Gateway found:', gateway,gateway._id);
      
      return gateway._id;
    } catch (error) {
      console.error('Error searching for Gateway:', error);
      throw error;
    }
  }
  
async function retriveDatabase() {
    const client = await connection.connectToDatabase();
    const db2 = client.db();
    const gatewaysCollection = db2.collection('PaymentMethod');
  
    try {
        const gateway = await gatewaysCollection.find().toArray();
        console.log(gateway);
  
  
      // Perform database operations here
  
    } catch (error) {
      console.error('Error connecting to the database:', error);
    } 
  }

async function closeConnection(client) {
    try {
        const client = await connection.connectToDatabase();
      await client.close();
      console.log('Disconnected from the database');
    } catch (error) {
      console.error('Error closing the database connection:', error);
    }
}
  
var gateway = {
    user_id: '647dcb19ad808d9242a84c20',
  method_name: 'Blockchain',
  method_details: 'Details about the blockchain payment method'
  };
  
gatewayname = "Blockchain";
(async () => {
    try {
      // Insert user
      const insertedGatewayId = await insertGateway(gateway);

      const insertedGatewayId2 = await searchGatewayByname(gatewayname);
      console.log('Inserted user ID:', insertedGatewayId2);
        await retriveDatabase();
      // Delete user
      await deleteGateway(insertedGatewayId2);
      await closeConnection();
      // await deleteUser(insertedUserId);
    } catch (error) {
      console.error('Error:', error);
    }
    finally {
        process.exit(0); // Exit the process
      }
  })();

