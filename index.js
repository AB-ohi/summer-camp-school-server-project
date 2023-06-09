const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qthn2pl.mongodb.net/?retryWrites=true&w=majority`;

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

    const InstructorsCollection = client.db("Melody-School").collection("Instructors");
    const classesCollection = client.db("Melody-School").collection("classes");
    const classSelectCollection = client.db("Melody-School").collection("classSelect");
    const usersCollection = client.db("Melody-School").collection("users");

    app.get("/Instructors", async(req,res)=>{
      const result = await InstructorsCollection.find().toArray();
      res.send(result);
    })
    
    
   
    //class site
    app.get("/classes", async(req,res)=>{
      const result = await classesCollection.find().toArray();
      res.send(result);
    })

    app.get("/classSelect", async(req, res)=>{
      const email = req.query.email;
      if(!email){
          res.send([])
      }
      const query ={email:email}
      const result = await classSelectCollection.find(query).toArray()
      res.send(result);
  })

    app.post("/classSelect",async(req,res)=>{
      const classSelect= req.body;
      console.log(classSelect)
      const result = await classSelectCollection.insertOne(classSelect);
      res.send(result)
  })

  app.delete('/classSelect/:id',async(req, res)=>{
    const id = req.params.id;
    console.log(id)
    const query = {_id: new ObjectId(id)};
    const result = await classSelectCollection.deleteOne(query);
    res.send(result)
  })

   //user aip

   app.get("/users", async (req, res) => {
    const result = await usersCollection.find().toArray();
    res.send(result);
  });
   app.post("/users", async(req, res) => {
    const user = req.body;
    const query = { email: user.email };
    const existingUser = await usersCollection.findOne(query);
    if (existingUser) {
      return res.send({ massage: "user already exists" });
    }
    const result = await usersCollection.insertOne(user);
    res.send(result);
  });
  app.patch("/users/admin/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: {
        role: "admin",
      },
    };
    const result = await usersCollection.updateOne(filter, updateDoc);
    res.send(result);
  });
  app.patch("/users/instructor/:id", async (req, res) => {
    const id = req.params.id;

    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: {
        role: "instructor",
      },
    };
    const result = await usersCollection.updateOne(filter, updateDoc);
    res.send(result);
  });
  app.delete('/users/:id',async(req, res)=>{
    const id = req.params.id;
    console.log(id)
    const query = {_id: new ObjectId(id)};
    const result = await usersCollection.deleteOne(query);
    res.send(result)
  })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', function(req,res) {
    res.send('server is running')
});

app.listen(port, ()=>{
    console.log(`the is school server is running on port: ${port}`)
})