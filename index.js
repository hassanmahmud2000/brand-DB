const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9a8z5mn.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const brandCollection = client.db("Brand-Product").collection("Products");
    const UserCollection = client.db("BrandDB").collection("User");
    // For SignUp
    app.post("/", async (req, res) => {
      const newUser = req.body;
      console.log(newUser);
      const result = await UserCollection.insertOne(newUser);
      res.send(result);
    });

    app.get('/signup',async(req,res)=>{
      const cursor = UserCollection.find();
      console.log(cursor);
      const result = await cursor.toArray();
      res.send(result);
    })



    // For Add Product
    app.post("/addproduct", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await brandCollection.insertOne(newProduct);
      res.send(result);
    });

    app.get('/addproduct',async(req,res)=>{
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.delete('/addproduct/:id',async(req,res)=>{
      const id  = req.params.id;
      const query = {_id: new ObjectId (id)} ;
      const result = await brandCollection.deleteOne(query);
      res.send(result);
    })

    app.get("/addproduct/:id", async (req, res) => {
      const id = req.params.id;
      console.log("id", id);
      const query = {
        _id: new ObjectId(id),
      };
      const result = await brandCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    app.put('/addproduct/:id',async(req,res)=>{
      const id = req.params.id;
      const data =  req.body;
      console.log(data);
      const filter = {_id: new ObjectId(id)}
      const option = {upsert:true};
      const updateProduct ={
        $set:{
           BrandName:data.BrandName, 
           ProductName:data.ProductName, 
           Price:data.Price, 
           PhotoURL:data.PhotoURL, 
           ShortDetails:data.ShortDetails 
        },
      };
      const result = await brandCollection.updateOne(filter,updateProduct,option);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
