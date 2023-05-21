const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors())
app.use(express.json())


// ------------------------------------------------------------------------

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dkozdag.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {

  // Connect the client to the server	(optional starting in v4.7)
  await client.connect();

  const dollCollection = client.db('babyDoll').collection('postDolls')

  // tabs collection
  const frozenCollection = client.db('babyDoll').collection('frozenDolls')
  const disneyCollection = client.db('babyDoll').collection('disneyDolls')
  const animationCollection = client.db('babyDoll').collection('animationDolls')

  // toys
  app.get('/toys', async (req, res) => {
    const cursor = dollCollection.find().limit(20)
    const result = await cursor.toArray();
    res.send(result)
  })

  //  search
  app.get("/searchToys/:text", async (req, res) => {
    const searchText = req.params.text;
    const result = await dollCollection.find({
      $or: [
        { title: { $regex: searchText, $options: "i" } },
        { description: { $regex: searchText, $options: "i" } }
      ]
    }).toArray()
    res.send(result)
  })



  // tabs collection start -------------------------
  app.get('/toysOne', async (req, res) => {
    const cursor = frozenCollection.find()
    const result = await cursor.toArray();
    res.send(result)
  })

  app.get('/toysTwo', async (req, res) => {
    const cursor = disneyCollection.find()
    const result = await cursor.toArray();
    res.send(result)
  })

  app.get('/toysThree', async (req, res) => {
    const cursor = animationCollection.find()
    const result = await cursor.toArray();
    res.send(result)
  })

  // single toysOne
  app.get("/toysOne/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await frozenCollection.findOne(query)
    res.send(result);
  });
  // single toysTwo
  app.get("/toysTwo/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await disneyCollection.findOne(query)
    res.send(result);
  });
  // single toysThree
  app.get("/toysThree/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await animationCollection.findOne(query)
    res.send(result);
  });

  // tabs collection end -------------------------



  // single toys
  app.get("/singleToys/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const options = {
      projection: { title: 1, email: 1, image: 1, available_quantity: 1, description: 1, skills: 1 },
    }
    const result = await dollCollection.findOne(query, options)
    res.send(result);
  });

  // some dollCollection
  app.get('/someToys', async (req, res) => {
    let query = {};
    if (req.query?.email) {
      query = { email: req.query.email }
    }
    const result = (await dollCollection.find(query).sort({ available_quantity: 1 }).toArray());
    res.send(result)
  })

  //post 
  app.post('/postToy', async (req, res) => {
    const body = req.body;

    if (!body) {
      return res.status(400).send({ message: "your request is bad request" })
    }
    const result = await dollCollection.insertOne(body)
    console.log(result)
    res.send(result)
  })

  // data updated
  app.patch('/someToys/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) }
    const updatedSomeData = req.body;
    console.log(updatedSomeData);
    const updateDoc = {
      $set: {
        status: updatedSomeData.status
      }
    };
    const result = await dollCollection.updateOne(filter, updateDoc);
    res.send(result)
  })


  // data delete
  app.delete('/someToys/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await dollCollection.deleteOne(query);
    res.send(result)
  })


  // Send a ping to confirm a successful connection
  await client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");

  //------------------------------------------------------------------------------------------------------------------------
  try {

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// ------------------------------------------------------------------------

app.get('/', (req, res) => {
  res.send('baby toy zone is start')
})


app.listen(port, () => {
  console.log(`Baby Toy Server is running on port: ${port}`)
})