const connectDB = require('./connectDB');

async function setCart() {
  try {
    const shareds = await connectDB.advancedRetrieve();
    return shareds;
  } catch (error) {
    console.error('Error setting cart:', error);
    return []; // Return an empty array or handle the error appropriately
  }
}

async function setProducts() {
  try {
    const products = await connectDB.retriveproduct();
    return products;
  } catch (error) {
    console.error('Error setting products:', error);
    return []; // Return an empty array or handle the error appropriately
  }
}

module.exports = { setCart, setProducts };
