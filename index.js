const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();


const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




// const uri = "mongodb+srv://girlyProject:x1Ja9yaAaRoy3VjC@cluster0.7nwjyzo.mongodb.net/?retryWrites=true&w=majority";

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7nwjyzo.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection = client.db("productsDB").collection("products");
    const brandCollection = client.db("brandDB").collection("brands");
    const cartCollection = client.db("productsDB").collection("cart");

    app.post('/products', async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result)
    });


    app.get('/products', async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    });

    app.get('/products/:id', async (req, res) => {
      const ids = req.params.id;
      const query = { _id: new ObjectId(ids) }
      const result = await productCollection.findOne(query)
      res.send(result)
    });


    app.put('/products/:id', async(req,res)=>{
      const ids = req.params.id;
      const filter = {_id : new ObjectId(ids)};
      const options = { upsert: true };
      const updatedProduct = req.body;
      const product ={
          $set : {
             
             name : updatedProduct.name,
             brand : updatedProduct.brand,
             type : updatedProduct.type,
             image : updatedProduct.image,
             price : updatedProduct.price,
             rating : updatedProduct.rating,
             description : updatedProduct.description
         }
      }

      const result = await productCollection.updateOne(filter,product,options);
      res.send(result)

  })



    app.get('/brands', async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    });



    app.get('/brands/:id', async (req, res) => {
      const ids = req.params.id;
      const query = { _id: new ObjectId(ids) }
      const result = await brandCollection.findOne(query)
      res.send(result)
    });




    app.post('/cart', async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await cartCollection.insertOne(newProduct);
      res.send(result)
    });

    app.get('/cart', async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    });

    app.get('/cart/:email', async (req, res) => {
      const userEmail = req.params.email;
      const query = { userEmail: userEmail }
      console.log(query);
      const result = await cartCollection.findOne(query)
      res.send(result)
    });


    app.get('/cart/:id', async (req, res) => {
      const ids = req.params.id;
      const query = {_id : new ObjectId(ids) }
      console.log(query);
      const result = await cartCollection.findOne(query)
      res.send(result)
    });


    app.delete('/cart/:id', async (req, res) => {
      const ids = req.params.id;
      const query = {_id : new ObjectId(ids)}
      const result = await cartCollection.deleteOne(query)
      res.send(result)
    });

   

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Girly project server is running....')
})

app.listen(port, () => {
  console.log(`Girly project server is running on port ${port}`)
})