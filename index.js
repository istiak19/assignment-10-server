require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fnfrn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // await client.connect();
        const campaignCollection = client.db('campaignDB').collection('campaign')
        const userCollection = client.db('campaignDB').collection('users')
        const donateCollection = client.db('campaignDB').collection('donates')

        // campaigns api
        app.get('/campaigns', async (req, res) => {
            const cursor = await campaignCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/campaigns/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) };
            const result = await campaignCollection.findOne(query);
            res.send(result)
        })

        app.post('/campaigns', async (req, res) => {
            const campaign = req.body
            const result = await campaignCollection.insertOne(campaign);
            res.send(result)
        })

        app.patch('/campaigns/:id', async (req, res) => {
            const id = req.params.id;
            const updateCampaign = req.body
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    image: updateCampaign.image,
                    title: updateCampaign.title,
                    type: updateCampaign.type,
                    description: updateCampaign.description,
                    donation: updateCampaign.donation,
                    deadline: updateCampaign.deadline,
                    email: updateCampaign.email,
                    name: updateCampaign.name
                },
            };
            const result = await campaignCollection.updateOne(filter, updateDoc);
            res.send(result)
        })

        app.delete('/campaigns/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await campaignCollection.deleteOne(query);
            res.send(result)
        })

        // Donate collection

        app.get('/donates', async (req, res) => {
            const cursor = await donateCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/donates/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) };
            const result = await donateCollection.findOne(query);
            res.send(result)
        })

        app.post('/donates', async (req, res) => {
            const donate = req.body
            const result = await donateCollection.insertOne(donate);
            res.send(result)
        })

        // Users api

        app.get('/users', async (req, res) => {
            const cursor = await userCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email
            const query = { email };
            const result = await userCollection.findOne(query);
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const user = req.body
            const result = await userCollection.insertOne(user);
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('FundSphere!')
})

app.listen(port, () => {
    console.log(`FundSphere app listening on port ${port}`)
})