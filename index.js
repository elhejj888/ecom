const express = require('express')
const ejs = require('ejs');
const bodyParser = require('body-parser')
const session = require("express-session")
const { MongoClient } = require('mongodb');
const rend0 = require('./node00/rend0')
const connectDB = require('./node00/connectDB')
const userDB = require('./node00/userDB')
const productDB = require('./node00/productDB')
const cartDB = require('./node00/cartDB')
const paypal = require("paypal-rest-sdk");
const cartItemsDB = require('./node00/cartItemsDB')




var app = express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.listen(6969)
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({secret:"secret"}))

app = rend0.render0(app)
connectDB.connectToDatabase();
app.post('/register',function(req,res){
    var name = req.body.nom
    var firstName = req.body.firstName
    var address = req.body.address
    var username = req.body.username
    var email = req.body.username
    var password = req.body.password
    var confirmPassword = req.body.confirmPassword

    if (password === confirmPassword) {
        var user = {name:name , firstName:firstName , address : address , username : username , email : email , password : password}
        req.session.users = [user]
        userID = userDB.insertUser(user)
        res.render('pages/login')

    } else {
        console.log("Password and confirm password do not match");
        // You can handle the error case here, such as showing an error message or redirecting to a different page
      }
    });

    app.post('/addProduct',function(req,res){
      const product = {
        title: req.body.title,
        price: parseFloat(req.body.price),
        brand: req.body.brand,
        code: req.body.code,
        stock: parseInt(req.body.stock),
        description: req.body.description,
        images: [req.body.image1, req.body.image2, req.body.image3],
      };
          req.session.Product = [product]
          productID = productDB.insertProduct(product)
          console.log('succeed')
          res.render('pages/login')
          console.log(global.guestcart , global.userCart)
      });

      let userCart;
    app.post('/login', async function (req, res) {
        var username = req.body.username;
        var password = req.body.password;
        console.log(username+" "+password)
        try {
          var user1 = await userDB.searchUserByUsername(username);
          
          if (user1) {
            if (user1.password === password) {
              req.session.users = user1; // Store the user object in the session
              console.log(user1._id); // Log the user ID
              global.userCart =userCart;
              // Redirect to a different page or send a success response
              res.render('pages/user-infos',{user : req.session.users});
              console.log(req.session.users)
            } else {
              console.log("Wrong password");
              // Render the login page with an error message
              res.render('pages/login', { error: "Wrong password" });
            }
          } else {
            console.log("Username does not exist");
            // Render the login page with an error message
            res.render('pages/login', { error: "Username does not exist" });
          }
        } catch (error) {
          console.error('Error searching for user:', error);
          // Handle the error case, such as rendering an error page or redirecting to a different page
          res.render('pages/error', { error: "An error occurred" });
        }
      });
      
      /* app.post('/addCart',async function (req, res) {
        // Extract the form data from the request body
        const id = req.body.id1;
        console.log(id)

      
        // Process the form data and perform necessary actions
        // For example, you can save the data to the database or perform any other operations
      
        // Return a response indicating the success or failure of the operation
        res.status(200).send('Form submission successful');
        console.log("submitted")
      }); */

      app.post('/addCart', (req, res) => {

          const productID = req.body.idp;
        const quantity = req.body.pquantity;
        const cartid = '649249505bf6389d5cc4fe08'
        global.guestcart = '649249505bf6389d5cc4fe08'
        const cart = {cart_id : cartid , product_id : productID , quantity : quantity}
        console.log(productID , quantity , cartid)
        const itemsdb = cartItemsDB.insertCartItems(cart)
        
        
        
        res.render('pages/cart_page', { error: "erreur connection" });
        
      });








// For a fully working example, please see:
// https://github.com/paypal-examples/docs-examples/tree/main/standard-integration

const { CLIENT_ID, APP_SECRET } = process.env;
const baseURL = {
    sandbox: "https://api-m.sandbox.paypal.com",
    production: "https://api-m.paypal.com"
};

// allow json body
app.use(express.json());

// create a new order
app.post("/create-paypal-order", async (req, res) => {
  const order = await createOrder();
  res.json(order);
});

// capture payment & store order information or fullfill order
app.post("/capture-paypal-order", async (req, res) => {
  const { orderID } = req.body;
  const captureData = await capturePayment(orderID);
  // TODO: store payment information such as the transaction ID
  res.json(captureData);
});

//////////////////////
// PayPal API helpers
//////////////////////

// use the orders api to create an order
async function createOrder() {
  const accessToken = await generateAccessToken();
  const url = `${baseURL.sandbox}/v2/checkout/orders`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: 50,
          },
        },
      ],
    }),
  });
  const data = await response.json();
  return data;
}

// use the orders api to capture payment for an order
async function capturePayment(orderId) {
  const accessToken = await generateAccessToken();
  const url = `${baseURL.sandbox}/v2/checkout/orders/${orderId}/capture`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  return data;
}

// generate an access token using client id and app secret
async function generateAccessToken() {
  const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64")
  const response = await fetch(`${baseURL.sandbox}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  const data = await response.json();
  return data.access_token;
}






      



