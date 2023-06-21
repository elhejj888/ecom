const connection = require('./connectDB')
const { MongoClient , ObjectID, ObjectId} = require('mongodb');

async function insertUser(user) {
    const client = await connection.connectToDatabase();
    const db2=client.db();
    const usersCollection = db2.collection('User');
  
    try {
      const result = await usersCollection.insertOne(user);
      const insertedUserId = result.insertedId; // Move the declaration and assignment inside the try block
      console.log('User inserted:', insertedUserId);
      return insertedUserId;
    } catch (error) {
      console.error('Error inserting user:', error);
      throw error;
    }
  }
  


async function updateUser(userId, updatedUser) {
    const client = await connection.connectToDatabase();
    const db2=client.db();
    const usersCollection = db2.collection('User');
  
    try {
      const result = await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: updatedUser }
      );
      console.log('User updated:', result.modifiedCount);
      return result.modifiedCount;
    } catch (error) {
      console.error('Error updating user:', error);
    }
}
  
async function deleteUser(userId) {
    const client = await connection.connectToDatabase();
    const db2=client.db();
    const usersCollection = db2.collection('User');
    
  
    try {
      const result = await usersCollection.deleteOne({ _id: userId });
      console.log('User deleted:', result.deletedCount);
      return result.deletedCount;
    } catch (error) {
      console.error('Error deleting user:', error);
    }
}

async function searchUserByUsername(username) {
    const client = await connection.connectToDatabase();
    const db2=client.db();
    const usersCollection = db2.collection('User');
  
    try {
      const user = await usersCollection.findOne({ username: username });
      console.log('User found:', user,user._id);
      
      return user._id;
    } catch (error) {
      console.error('Error searching for user:', error);
      throw error;
    }
  }
  
async function retriveDatabase() {
    const client = await connection.connectToDatabase();
    const db2 = client.db();
    const usersCollection = db2.collection('User');
  
    try {
        const users = await usersCollection.find().toArray();
        console.log(users);
  
  
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
  

  
(async () => {
    try {
      // Insert user
      const insertedUserId = await searchUserByUsername(username);
      console.log('Inserted user ID:', insertedUserId);
  
      // Delete user
      await deleteUser(insertedUserId);
      await closeConnection();
      // await deleteUser(insertedUserId);
    } catch (error) {
      console.error('Error:', error);
    }
    finally {
        process.exit(0); // Exit the process
      }
  })();

