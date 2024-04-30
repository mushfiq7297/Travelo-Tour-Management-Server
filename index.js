const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//middileware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.em0grxr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

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
    const addSpotCollection = client
      .db("addSpotDB")
      .collection("addTouristsspot");
    //READ data
    app.get("/addTouristsspot", async (req, res) => {
      const cursor = addSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //UPDATE data
    app.get("/addTouristsspot/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addSpotCollection.findOne(query);
      res.send(result);
    });

    app.put("/addTouristsspot/:id", async (req, res) => {
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)}
    const options = {upsert: true};
    const updateSpot = req.body;
    const spot = {
      $set:{
        touristspotsname: updateSpot.touristspotsname,
          countryname: updateSpot.countryname,
          location: updateSpot.location,
          shortdescription: updateSpot.shortdescription,
          photourl: updateSpot.photourl,
          averagecost: updateSpot.averagecost,
          seasonality: updateSpot.seasonality,
          traveltime: updateSpot.traveltime,
          totavisitorsperyear: updateSpot.totavisitorsperyear,
          email: updateSpot.email,
          name: updateSpot.name,
      }
    }
    const result = await addSpotCollection.updateOne(filter,spot,options);
    res.send(result)
  }  
    
  )

    //CREATE data

    app.post("/addTouristsspot", async (req, res) => {
      console.log(req.body);
      const result = await addSpotCollection.insertOne(req.body);
      res.send(result);
    });

    //DELETE data
    app.delete("/addTouristsspot/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addSpotCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("travel website server is running");
});

app.listen(port, () => {
  console.log(`travel server is running on port: ${port}`);
});
