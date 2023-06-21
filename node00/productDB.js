const connection = require('./connectDB')
const { MongoClient , ObjectID, ObjectId} = require('mongodb');

async function insertProduct(product) {
    const client = await connection.connectToDatabase();
    const db2=client.db();
    const productsCollection = db2.collection('Product');
  
    try {
      const result = await productsCollection.insertOne(product);
      const insertedProductId = result.insertedId; // Move the declaration and assignment inside the try block
      console.log('Product inserted:', insertedProductId);
      return insertedProductId;
    } catch (error) {
      console.error('Error inserting product:', error);
      throw error;
    }
  }
  


async function updateProduct(productId, updatedProduct) {
    const client = await connection.connectToDatabase();
    const db2=client.db();
    const productsCollection = db2.collection('Product');
  
    try {
      const result = await productsCollection.updateOne(
        { _id: new ObjectId(productId) },
        { $set: updatedProduct }
      );
      console.log('Product updated:', result.modifiedCount);
      return result.modifiedCount;
    } catch (error) {
      console.error('Error updating product:', error);
    }
}
  
async function deleteProduct(productId) {
    const client = await connection.connectToDatabase();
    const db2=client.db();
    const productsCollection = db2.collection('Product');
    console.log(productId)
    
  
    try {
      const result = await productsCollection.deleteOne({ _id: productId});
      console.log('Product deleted:', result.deletedCount);
      return result.deletedCount;
    } catch (error) {
      console.error('Error deleting Product:', error);
    }
}

async function searchProductByname(productname) {
    const client = await connection.connectToDatabase();
    const db2=client.db();
    const productsCollection = db2.collection('Product');
  
    try {
      const product = await productsCollection.findOne({ name: productname });
      console.log('User found:', product,product._id);
      
      return product._id;
    } catch (error) {
      console.error('Error searching for product:', error);
      throw error;
    }
  }

  async function searchProductById(productId) {
    const client = await connection.connectToDatabase();
    const db2=client.db();
    const productsCollection = db2.collection('Product');
  
    try {
      const product = await productsCollection.findOne({ _id: new ObjectId( productId )});      
      return product;
    } catch (error) {
      console.error('Error searching for product:', error);
      throw error;
    }
  }
  
async function retriveDatabase() {
    const client = await connection.connectToDatabase();
    const db2 = client.db();
    const productsCollection = db2.collection('Product');
  
    try {
        const products = await productsCollection.find().toArray();
        return products;
          
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

module.exports = {closeConnection , retriveDatabase , searchProductByname , deleteProduct , updateProduct , insertProduct , searchProductById}


  
// var product = {
//     name: 'Product 2',
//     description: 'This is product 2',
//     price: 19.99,
//     image_url: 'https://example.com/product2.jpg',
//     created_at: new Date(),
//     updated_at: new Date()
//   };
  
// productname = "Product 1";
// (async () => {
//     try {
//       // Insert user
//       const insertedProductId = await insertProduct(product);

//       const insertedProductId2 = await searchProductByname(productname);
//       console.log('Inserted user ID:', insertedProductId2);
//         await retriveDatabase();
//       // Delete user
//       await deleteProduct(insertedProductId2);
//       await closeConnection();
//       // await deleteUser(insertedUserId);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//     finally {
//         process.exit(0); // Exit the process
//       }
//   })();

