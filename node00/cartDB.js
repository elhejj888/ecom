const connection = require('./connectDB')
const { MongoClient , ObjectID, ObjectId} = require('mongodb');

async function insertCart(cart) {
    const client = await connection.connectToDatabase();
    const db2=client.db();
    const cartsCollection = db2.collection('Cart');
  
    try {
      const result = await cartsCollection.insertOne(cart);
      const insertedCartId = result.insertedId; // Move the declaration and assignment inside the try block
      console.log('Cart inserted:', insertedCartId);
      return insertedCartId;
    } catch (error) {
      console.error('Error inserting Cart:', error);
      throw error;
    }
  }
  


async function updateCart(cartId, updatedCart) {
    const client = await connection.connectToDatabase();
    const db2=client.db();
    const cartsCollection = db2.collection('Cart');
  
    try {
      const result = await cartsCollection.updateOne(
        { _id: new ObjectId(cartId) },
        { $set: updatedCart }
      );
      console.log('Cart updated:', result.modifiedCount);
      return result.modifiedCount;
    } catch (error) {
      console.error('Error updating Cart:', error);
    }
}
  
async function deleteCart(cartId) {
    const client = await connection.connectToDatabase();
    const db2=client.db();
    const cartsCollection = db2.collection('Cart');
    
  
    try {
      const result = await cartsCollection.deleteOne({ _id: cartId });
      console.log('Cart deleted:', result.deletedCount);
      return result.deletedCount;
    } catch (error) {
      console.error('Error deleting Cart:', error);
    }
}

async function searchCartByUserId(userId) {
    const client = await connection.connectToDatabase();
    const db2=client.db();
    const cartsCollection = db2.collection('Cart');
  
    try {
      const cart = await cartsCollection.findOne({ user_id: userId });
      console.log('Cart found:', cart,cart._id);
      return cart._id;
    } catch (error) {
      var cart = {user_id : userId}
      var idd = insertCart(cart)
      return idd;
    }
  }
  
async function retriveDatabase() {
    const client = await connection.connectToDatabase();
    const db2 = client.db();
    const ordersCollection = db2.collection('Cart');
  
    try {
        const carts = await ordersCollection.find().toArray();
        console.log(carts);
  
  
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

async function retrieveCartItems2(cartId) {
  try {
    const database = client.db('your_database_name'); // Replace with your database name
    const cartItemsCollection = database.collection('CartItems');
    const productsCollection = database.collection('Products');

    const cartItems = await cartItemsCollection.find({ cart_id: cartId }).toArray();
    console.log(cartItems)
    const orderInformation = [];

    for (const item of cartItems) {
      console.log(item+"_______")

      const product = await productsCollection.findOne({ _id: ObjectId(item.product_id) });

      const orderItem = {
        id: item.product_id,
        images: product.images,
        title: product.title,
        price: product.price,
        code: product.code,
        brand: product.brand,
        quantity: item.quantity
      };

      orderInformation.push(orderItem);
    }

    return orderInformation;
  } catch (error) {
    console.error('Error retrieving order information:', error);
    throw error; // Throw the error to handle it outside the function
  }
}

async function retrieveUser() {
  try {
    const database = client.db('your_database_name'); // Replace with your database name
    const usersCollection = database.collection('User');

    const users = await usersCollection.find().toArray();

    return users;
  } catch (error) {
    console.error('Error retrieving user information:', error);
    throw error; // Throw the error to handle it outside the function
  }
}

async function advancedRetrieve() {
  const client = await connection.connectToDatabase();
  const db = client.db();
  const orderItemsCollection = await db.collection('CartItems');
  const orderItems = await orderItemsCollection.find({}).toArray();

  // Retrieve products based on product IDs in order items
  const productIds = orderItems.map((item) => item.product_id);
  const productsCollection = await db.collection('Product');
  const products = await productsCollection.find({ _id: { $in: productIds } }).toArray();

  // Associate products with order items
  const orderItemsWithProducts = orderItems.map((item) => {
    const product = products.find((p) => p._id === item.product_id);
    if (product) {
      const pp = {
        cartid: item.cart_id,
        orderId: item._id,
        id: item.product_id,
        images: product.images,
        title: product.title,
        price: product.price,
        code: product.code,
        brand: product.brand,
        quantity: item.quantity,
        stock: product.stock
      };
      console.log(pp);
      return pp;
    } else {
      const pp2 = {
        cartid: item.cart_id,
        orderId: item._id,
        id: item.product_id,
        quantity: item.quantity,
      };
      console.log(`No product found for cart item with ID ${item._id}`);
      return null; // Or handle the empty product case in an appropriate way
    }
  });

  // Remove null entries from the array
  const filteredOrderItemsWithProducts = orderItemsWithProducts.filter((item) => item !== null);

  cart = filteredOrderItemsWithProducts;
  return cart;
  // Now you have the order items with their associated products
}

module.exports = {advancedRetrieve , insertCart , searchCartByUserId,retrieveCartItems2}



// var cart = {
// user_id : "647dcb19ad808d9242a84c20",
// created_at : new Date(),
// updated_at : new Date()
//   };
  
// userId = '647dcb19ad808d9242a84c20';
// (async () => {
//     try {
//       // Insert user
//       const insertedOrderId = await insertCart(cart);

//       const insertedCartId2 = await searchCartByUserId(userId);
//       console.log('Inserted user ID:', insertedCartId2);
//         await retriveDatabase();
//       // Delete user
//         await deleteCart(insertedCartId2);
      
//       await closeConnection();
//       // await deleteUser(insertedUserId);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//     finally {
//         process.exit(0); // Exit the process
//       }
//   })();
advancedRetrieve();

