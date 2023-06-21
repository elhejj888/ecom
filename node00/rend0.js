const express = require('express')
const ejs = require('ejs');
const bodyParser = require('body-parser')
const session = require("express-session")
const productDB = require('./productDB')
const cartDB = require('./cartDB')
const connectDB = require('./connectDB')

const locals = require('./locals')


function render0(app){
  app.use(async (req, res, next) => {
    var shareds;
    try {
      
       shareds = await connectDB.advancedRetrieve()
       res.locals.shareds = shareds; // Make shareds available in res.locals
       global.shareds = shareds
      res.locals.shareds = shareds; // Make shareds available in res.locals
      global.shareds = shareds
      next(); // Call the next middleware or route handler
    } catch (error) {
      console.error('Error retrieving shareds:', error);
      // Handle the error appropriately
    }
  });
  locals.setCart()
  .then((shareds) => {
   })

   app.use(async (req, res, next) => {
    try {
      const products = await connectDB.retriveproduct();
      res.locals.products = products; // Make shareds available in res.locals
      
      next(); // Call the next middleware or route handler
    } catch (error) {
      console.error('Error retrieving shareds:', error);
      // Handle the error appropriately
    }
  });
  locals.setProducts()
  .then((products) => {
   })

 
  
  
    
    app.get('/addProduct',function(req,res){
        res.render('pages/product' , { products:res.locals.products,shareds:res.locals.shareds})
    })
    app.get('/home',function(req,res){

        res.render('pages/index', {products:res.locals.products , shareds:res.locals.shareds})
    })
    app.get('/',function(req,res){

        res.render('pages/index', {products:res.locals.products , shareds:res.locals.shareds})
    })

    //app.get('/login',function(req,res){
      //  res.render('pages/login')
    //})

    app.get('/blog',function(req,res){

        res.render('pages/blog_page', {shareds:res.locals.shareds})
    })

    app.get('/cart',async (req, res) => {
      try {
        cart = await connectDB.advancedRetrieve();
        req.session.cart = cart
        res.render('pages/cart_page',{products:res.locals.products , cart , shareds:res.locals.shareds})
      } catch (error) {
          console.error('An error occurred:', error);
          res.status(500).send('An error occurred');
      }
    })

    app.get('/about',function(req,res){

        res.render('pages/about', {shareds:res.locals.shareds})
    })

  
    app.get('/category', async (req, res) => {

            try {
              // Retrieve products from the database
              products = await connectDB.retriveproduct();
          
              // Store products in the session variable
              req.session.product = products;
          
              // Render the products template and pass the products as a variable
              res.render('pages/category_page', { products:res.locals.products , shareds:res.locals.shareds });
            } catch (error) {
              console.error('An error occurred:', error);
              res.status(500).send('An error occurred');
            }
    });
    

    app.get('/checkout',function(req,res){     

        res.render('pages/checkout_page', {products:res.locals.products , shareds:res.locals.shareds})
    })

    app.get('/contact',function(req,res){
        res.render('pages/contact_us', {shareds:res.locals.shareds})
    })

    app.get('/product',function(req,res){

      const productId = req.query.id;

      const handleProduct = async () => {
        try {
          // Fetch the product details from the database using the product ID
          const product = await productDB.searchProductById(productId);
    
          // Store the product in the session variable
          req.session.product2 = product;
    
          // Pass the product details to the product_detail_page view
          res.render('pages/product_detail_page', { product ,shareds:res.locals.shareds});
        } catch (error) {
          console.error('Error retrieving product:', error);
          res.status(500).send('Error retrieving product');
        }
      };
    
      // Call the async wrapper function immediately
      handleProduct();
    });

    app.get('/singleblog',function(req,res){

        res.render('pages/single_blog',{shareds:res.locals.shareds});
    });

    app.get('/login', (req, res) => {

        // Check if 'users' value exists in the session
        if (req.session.users) {
          res.locals.shareds.userid = req.session.users._id
          console.log("_____"+res.locals.shareds.userid)
          // User is logged in, render the user information page
          res.render('pages/user-infos', { user: req.session.users , shareds:res.locals.shareds });
        } else {
          // User is not logged in, render the login page
          res.render('pages/login');
        }
      });


      app.get('/logout', (req, res) => {

        // Destroy the session and clear the 'users' value
        req.session.destroy();
      
        // Redirect to the homepage
        res.redirect('/login', );
      });

    return app
}

module.exports = {render0}