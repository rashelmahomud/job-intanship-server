const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express()

// mideleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f6d42pg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     client.close();
// });


async function run() {

    try {
        await client.connect();
        const db = client.db("jobCollection");
        const carearCollection = client.db('jobCollection').collection('carear');
        const userCollection = client.db('jobCollection').collection('user');
        const userJobCollection = client.db('jobCollection').collection('job');
        const userApplyJobCollection = client.db('jobCollection').collection('applyJob');
        console.log('Hello')


        app.post('/user', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        app.post('/applyJob', async (req, res) => {
            const jobApply = req.body;
            const jobResult = await userApplyJobCollection.insertOne(jobApply);
            res.send(jobResult);
        })

        app.get('/applyed', async (req, res) => {
            const getapplayed = userApplyJobCollection.find({})
            const getResult = await getapplayed.toArray();
            res.send(getResult);
        })




        app.get("/user/:email", async (req, res) => {
            const email = req.params.email;
            const result = await userCollection.findOne({ email });
            console.log(result)
            if (result?.email) {
                return res.send({ status: true, data: result });
            }
            res.send({ status: false });
        });


        app.post('/job', async (req, res) => {
            const job = req.body;
            const jobResult = await userJobCollection.insertOne(job);
            res.send(jobResult)
        });

        app.get('/jobs', async (req, res) => {
            const getJob = userJobCollection.find({});
            const getResult = await getJob.toArray();
            res.send({ status: true, data: getResult })
        });

        app.get('/job/:id', async (req, res) => {
            const id = req.params.id;
            const result = await userJobCollection.findOne({ _id: new ObjectId(id) });
            res.send({ status: true, data: result });
        });


        app.get('/carear', async (req, res) => {
            const carear = carearCollection.find({});
            const result = await carear.toArray();
            res.send({ status: true, data: result })
        })

    }


    finally {

    }

}
run().catch((err) => console.log(err));



app.get('/', (req, res) => {
    res.send('Hello World! Rashel Mahomud')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})