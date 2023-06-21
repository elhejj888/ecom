const connection = require('./connectDB')
const { MongoClient , ObjectID, ObjectId} = require('mongodb');

async function insertOrder(order) {
    const client = await connection.connectToDatabase();
    const db2=client.db();
    const ordersCollection = db2.collection('Order');
  
    try {
      const result = await ordersCollection.insertOne(order);
      const insertedOrderId = result.insertedId; // Move the declaration and assignment inside the try block
      console.log('Order inserted:', insertedOrderId);
      return insertedOrderId;
    } catch (error) {
      console.error('Error inserting Order:', error);
      throw error;
    }
  }
  


async function updateOrder(orderId, updatedOrder) {
    const client = await connection.connectToDatabase();
    const db2=client.db();
    const ordersCollection = db2.collection('Order');
  
    try {
      const result = await ordersCollection.updateOne(
        { _id: new ObjectId(orderId) },
        { $set: updatedOrder }
      );
      console.log('Order updated:', result.modifiedCount);
      return result.modifiedCount;
    } catch (error) {
      console.error('Error updating Order:', error);
    }
}
  
async function deleteOrder(orderId) {
    const client = await connection.connectToDatabase();
    const db2=client.db();
    const ordersCollection = db2.collection('Order');
    
  
    try {
      const result = await ordersCollection.deleteOne({ _id: orderId });
      console.log('Order deleted:', result.deletedCount);
      return result.deletedCount;
    } catch (error) {
      console.error('Error deleting Order:', error);
    }
}

async function searchOrderByUserId(userId) {
    const client = await connection.connectToDatabase();
    const db2=client.db();
    const ordersCollection = db2.collection('Order');
  
    try {
      const order = await ordersCollection.findOne({ user_id: userId });
      console.log('Order found:', order,order._id);
      
      return order._id;
    } catch (error) {
      console.error('Error searching for Order:', error);
      throw error;
    }
  }
  
async function retriveDatabase() {
    const client = await connection.connectToDatabase();
    const db2 = client.db();
    const ordersCollection = db2.collection('Order');
  
    try {
        const orders = await ordersCollection.find().toArray();
        console.log(orders);
  
  
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
  
var order = {
    user_id: '647dcb19ad808d9242a84c20',
    total_amount: 50.99,
    created_at: '2023-06-05T12:00:00Z',
    updated_at: '2023-06-05T12:00:00Z'
  };
  
userId = '647dcb19ad808d9242a84c20';
(async () => {
    try {
      // Insert user
      const insertedOrderId = await insertOrder(order);

      const insertedOrderId2 = await searchOrderByUserId(userId);
      console.log('Inserted user ID:', insertedOrderId2);
        await retriveDatabase();
      // Delete user
        await deleteOrder(insertedOrderId2);
      
      await closeConnection();
      // await deleteUser(insertedUserId);
    } catch (error) {
      console.error('Error:', error);
    }
    finally {
        process.exit(0); // Exit the process
      }
  })();

