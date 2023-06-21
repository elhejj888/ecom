const connection = require('./connectDB')
const { MongoClient , ObjectID, ObjectId} = require('mongodb');

async function insertCartItems(cartItems) {
    const client = await connection.connectToDatabase();
    const db2=client.db();
    const cartItemsCollection = db2.collection('CartItems');
  
    try {
      const result = await cartItemsCollection.insertOne(cartItems);
      const insertedCartItemsId = result.insertedId; // Move the declaration and assignment inside the try block
      console.log('CartItems inserted:', insertedCartItemsId);
      return insertedCartItemsId;
    } catch (error) {
      console.error('Error inserting CartItems:', error);
      throw error;
    }
  }
  


async function updateCartItems(cartItemsId, updatedCartItems) {
    const client = await connection.connectToDatabase();
    const db2=client.db();
    const cartItemsCollection = db2.collection('CartItems');
  
    try {
      const result = await cartItemsCollection.updateOne(
        { _id: new ObjectId(cartItemsId) },
        { $set: updatedCartItems }
      );
      console.log('CartItems updated:', result.modifiedCount);
      return result.modifiedCount;
    } catch (error) {
      console.error('Error updating CartItems:', error);
    }
}
  
async function deleteCartItems(cartItemsId) {
    const client = await connection.connectToDatabase();
    const db2=client.db();
    const cartItemsCollection = db2.collection('CartItems');
    
  
    try {
      const result = await cartItemsCollection.deleteOne({ _id: cartItemsId });
      console.log('CartItems deleted:', result.deletedCount);
      return result.deletedCount;
    } catch (error) {
      console.error('Error deleting CartItems:', error);
    }
}

async function searchCartItemsByCartId(cartId) {
    const client = await connection.connectToDatabase();
    const db2=client.db();
    const cartItemsCollection = db2.collection('CartItems');
  
    try {
      const cartItems = await cartItemsCollection.findOne({ cart_id: cartId });
      console.log('Cart found:', cartItems,cartItems._id);
      
      return cartItems._id;
    } catch (error) {
      console.error('Error searching for Cart:', error);
      throw error;
    }
  }
  
async function retriveDatabase() {
    const client = await connection.connectToDatabase();
    const db2 = client.db();
    const cartItemsCollection = db2.collection('CartItems');
  
    try {
        const cartItems = await cartItemsCollection.find().toArray();
        console.log(cartItems);
  
  
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
  
module.exports = {insertCartItems,retriveDatabase,searchCartItemsByCartId}
/* var cartItems = {
    cart_id: "647dc7eaad808d9242a84bfc",
    product_id : "647dc7d4ad808d9242a84bf9",
    quantity : 2,
    created_at: "2023-06-05T12:00:00Z",
    updated_at : "2023-06-05T12:00:00Z"
  };
  
cartId = '647dc7eaad808d9242a84bfc';
(async () => {
    try {
      // Insert user
      const insertedCartId = await insertCartItems(cartItems);

      const insertedCartId2 = await searchCartItemsByCartId(cartId);
      console.log('Inserted Cart ID:', insertedCartId2);
        await retriveDatabase();
      // Delete user
        await deleteCartItems(insertedCartId2);
      
      await closeConnection();
      // await deleteUser(insertedUserId);
    } catch (error) {
      console.error('Error:', error);
    }
    finally {
        process.exit(0); // Exit the process
      }
  })(); */

