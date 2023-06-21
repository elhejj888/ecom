const { MongoClient , ObjectID, ObjectId} = require('mongodb');
const connection = require('./connectDB')

//A function to insert users in the database
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

//function to update user
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

//function to delete user
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


//function to search for a user using his name
async function searchUserByUsername(username) {
    const client = await connection.connectToDatabase();
    const db2=client.db();
    const usersCollection = db2.collection('User');
  
    try {
      const user = await usersCollection.findOne({ username: username });
      return user;


    } catch (error) {
      console.error('Error searching for user:', error);
      throw error;
    }
  }

//function to upload all the user data
async function retriveDatabase() {
    const client = await connection.connectToDatabase();
    const db2 = client.db();
    const usersCollection = db2.collection('User');
  
    try {
        const users = await usersCollection.find().toArray();  
        return users
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
  
module.exports={insertUser,
    updateUser,
    deleteUser,
    closeConnection,
    searchUserByUsername,
    retriveDatabase
}

  
// (async () => {
//     try {
//       // Insert user
//       const insertedUserId = await searchUserByUsername(username);
//       console.log('Inserted user ID:', insertedUserId);
  
//       // Delete user
//       await deleteUser(insertedUserId);
//       await closeConnection();
//       // await deleteUser(insertedUserId);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//     finally {
//         process.exit(0); // Exit the process
//       }
//   })();

