const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;



//middleware
app.use(cors());
app.use(express.json());

//mongo-db
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cnnr8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri);

async function run() {
    try {
        await client.connect();
        // console.log('database connect successfully');
        const database = client.db("tourrism");
        const serviceCollection = database.collection("services");
        const RegUserCollection = database.collection("regUser");
        const reviewCollection = database.collection("userReview");

        //GET API
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        //GET API With id
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.json(service);
        })
        //ADD REG USER oder API
        app.post('/regUser', async (req, res) => {
            const regUser = req.body;
            const result = await RegUserCollection.insertOne(regUser);
            res.json(result);
        })
        //GET API my booking
        app.get('/myBooking', async (req, res) => {
            const cursor = RegUserCollection.find({});
            const booking = await cursor.toArray();
            res.send(booking);
        })
        //DELETE My booking
        app.delete('/myBooking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id:ObjectId(id) };
            const result = await RegUserCollection.deleteOne(query);
            res.json(result);
        })
        app.get('/myBooking/:uid', async (req, res) => {
            const uid = [req.params.uid];
            const query = { uid: { $in: uid } };
            const result = await RegUserCollection.find(query).toArray();
            // console.log(result);
            res.json(result);
        })
        //DELETE booking from all booking
        app.delete('/myBooking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id:ObjectId(id) };
            const result = await RegUserCollection.deleteOne(query);
            res.json(result);
        })
        //ADD new serices
        app.post('/services', async (req, res) => {
            const services = req.body;
            const result = await serviceCollection.insertOne(services);
            res.json(result);
        })
        //UPDATE Status
        app.put('/myBooking/:id', async (req, res) => {
            const id = req.params.id;
            const updateBooking = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upset: true };
            const updateDoc = {
                $set: {
                    status: "booked"
                },
            };
            const result = await RegUserCollection.updateOne(filter, updateDoc, options);
            res.json(result)
        })
        //ADD Feedback user
        app.post('/userReview', async (req, res) => {
            const userReview = req.body;
            const result = await reviewCollection.insertOne(userReview);
            res.json(result);
        })
        //GET Feedback
        app.get('/userReview', async (req, res) => {
            const cursor = reviewCollection.find({});
            const userReview = await cursor.toArray();
            res.send(userReview);
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('i am from tourism server');
})

app.listen(port, () => {
    console.log('running server on port', port);
})