const { MongoClient, ObjectId } = require('mongodb');



let client;
async function connectToDatabase(){
    const uri = 'mongodb+srv://elhejjiouiyoussef:@cluster0.3n3q0pr.mongodb.net/EcomStore';
    client = new MongoClient(uri);
  
    try {
      await client.connect();
      console.log('Connected to the database');
      return client;
    } catch (error) {
      console.error('Error connecting to the database:', error);
    }
  }
client = connectToDatabase();
  async function retriveproduct() {
    const db = client.db();
    const productsCollection =await db.collection('Product');
  
    try {
        const products = await productsCollection.find().toArray();
        return products;
          
    } catch (error) {
      console.error('Error connecting to the database:', error);
    } 
  }
  async function retriveOrders() {
    const db = client.db();
    const ordersCollection =await db.collection('Order');
  
    try {
        const orders = await ordersCollection.find().toArray();
        console.log(orders);
  
  
      // Perform database operations here
  
    } catch (error) {
      console.error('Error connecting to the database:', error);
    } 

  }


  async function advancedRetrieve() {
    try {
      const db = client.db();
      const orderItemsCollection = db.collection('CartItems');
      const orderItems = await orderItemsCollection.find().toArray();
  
      // Retrieve products based on product IDs in order items
      const productIds = orderItems.map((item) => item.product_id);
      const productsCollection = db.collection('Product');
      const products = await productsCollection.find({ _id: { $in: productIds.map(id => new ObjectId(id)) } }).toArray();
  
      // Associate products with order items
      const orderItemsWithProducts = orderItems.map((item) => {
        const product = products.find((p) => p._id.toString() === item.product_id.toString());
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
        }
        console.log(`No product found for order item with ID ${item._id}`);
        return null;
      });
  
      // Remove null entries from the array
      const filteredOrderItemsWithProducts = orderItemsWithProducts.filter((item) => item !== null);
      return filteredOrderItemsWithProducts;
    } catch (error) {
      console.error('Error retrieving advanced data:', error);
      throw error;
    }
  }
  
  

  async function retrieveCartItems2(cartId) {
    const db = client.db();
    const orderItemsCollection = await db.collection('CartItems');
    const orderItems = await orderItemsCollection.find({ cart_id: new ObjectId(cartId) }).toArray();

    if (orderItems.length === 0) {
      console.log(`No order items found for cart with ID ${cartId}`);
      return [];
    }
  
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
        console.log(`No product found for order item with ID ${item._id}`);
        return null; // Or handle the empty product case in an appropriate way
      }
    });
  
    return orderItemsWithProducts;
  }
  

  async function retriveUser() {
    const db = client.db();
    const usersCollection =await db.collection('User');
  
    try {
        const users = await usersCollection.find().toArray();  
        return users
      // Perform database operations here
  
    } catch (error) {
      console.error('Error connecting to the database:', error);
    } 
  }

  async function retriveCartItems() {
    const db = client.db();
    const cartItemsCollection =await db.collection('CartItems');
  
    try {
        const cartItems = await cartItemsCollection.find().toArray();
        console.log(cartItems);
  
  
      // Perform database operations here
  
    } catch (error) {
      console.error('Error connecting to the database:', error);
    } 
  }
  async function searchCartItemsByCartId(cartId) {
    const db2=client.db();
    const cartItemsCollection = await db2.collection('CartItems');
  
    try {
      const cartItems = await cartItemsCollection.find(cart_id =new ObjectId( cartId)).toArray();
      console.log('Cart found:', cartItems,cartItems._id);
      
      return cartItems;
    } catch (error) {
      console.error('Error searching for Cart:', error);
      throw error;
    }
  }
  module.exports = {connectToDatabase,retrieveCartItems2, retriveproduct, retriveOrders, advancedRetrieve, retriveUser, retriveCartItems,searchCartItemsByCartId}
