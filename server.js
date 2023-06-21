const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 8080;
const uri = 'mongodb+srv://elhejjiouiyoussef:Ysf6969@cluster0.3n3q0pr.mongodb.net/EcomStore';

app.use(express.urlencoded({ extended: true }));

// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Add product route
app.post('/addProduct', (req, res) => {
  const product = {
    title: req.body.title,
    price: parseFloat(req.body.price),
    brand: req.body.brand,
    code: req.body.code,
    stock: parseInt(req.body.stock),
    description: req.body.description,
    images: [req.body.image1, req.body.image2, req.body.image3],
  };

  MongoClient.connect(uri, (err, client) => {
    if (err) {
      console.error('Error connecting to MongoDB:', err);
      res.status(500).send('Error connecting to MongoDB');
      return;
    }

    const db = client.db(); // Obtain the database instance

    const collection = db.collection('Product');

    collection.insertOne(product, (err, result) => {
      if (err) {
        console.error('Error inserting product:', err);
        res.status(500).send('Error inserting product');
      } else {
        console.log('Product inserted successfully:', result.insertedCount);
        res.send('Product added successfully!');
      }

      client.close(); // Close the MongoDB connection
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

<form action="/addCart" method="post">
                            <input type="hidden" name="id" value="<%=product._id%>">
                            <input type="hidden" name="id" value="<%=product.title%>">
                            <input type="hidden" name="id" value="<%=product.price%>">
                            <input type="hidden" name="id" value="<%=product.code%>">
                            <div class="add-to-cart"><a href="#" onclick="submit"><span>Add to cart</span><div
<div class="add-to-cart"><a href="www.google.com" onclick="submitForm(event)"></a></div>


<script>
  function submitForm(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    
    var form = document.getElementById("cartform");
    var formData = new FormData(form);
    
    var xhr = new XMLHttpRequest();
    xhr.open("POST", form.action, true);
    xhr.onload = function() {
      // Handle the response from the server
      if (xhr.status === 200) {
        // Request was successful, handle the response as needed
        console.log(xhr.responseText);
      } else {
        // Request failed, handle the error
        console.error("Request failed with status:", xhr.status);
      }
    };
    xhr.onerror = function() {
      // Handle any network errors
      console.error("Network error occurred");
    };
    xhr.send(formData);
  }
</script>


</form>
</div>
</a></div>
