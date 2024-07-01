require('dotenv').config();

const express = require('express');
const app = express();

const bcrypt = require('bcrypt');

const addVideoToDatabase = require('../add-video-api');

const { MongoClient } = require('mongodb');
const uri = require('../atlas_uri');

const axios = require('axios');

const client = new MongoClient(process.env.MONGODB_URI, {
    connectTimeoutMS: 100000,
});

const dbname = 'felineHoldings';
const mbsRecentVideos = client.db(dbname).collection('mbsRecentVideos');

async function connectToDatabase() {
    try {
        await client.connect();
        console.log(`Connected to the ${dbname} database.`);
    } catch (error) {
        console.error(`Error connecting to the ${dbname} database.`)
        console.error(error);
    }
}

connectToDatabase();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('You have reached the API of Feline Holdings!')
})

app.post('/mbs/add-video', async (req, res) => {
    bcrypt.compare(req.body.password, process.env.MY_PASSWORD_HASH, (err, result) => {
        try {
            console.log(result);
            if (result === false) {
                res.send(false);
            } else {
                console.log('trying to run addVideoToDatabase()')
                addVideoToDatabase(mbsRecentVideos);
                res.send(true);
            }
        } catch (error) {
            console.error(error);
            res.send(error);
        }
    })
})

app.get('/echoback', (req, res) => {
    res.json({
        "firstValue": req.query.firstValue,
        "secondValue": req.query.secondValue
    })
})

app.get('/intraroute', (req, res) => {
    res.send('IntraRoute API coming soon.');
})

app.get('/mbs/recent-videos', (req, res) => {
    async function findVideos() {
        try {
            let videos = await mbsRecentVideos.find({}).sort({ date: -1 }).toArray();
            console.log(videos);
            res.send(videos);
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }
    findVideos();
})

app.get('/mbs/live-now', (req, res) => {
    axios.get('https://www.youtube.com/channel/UCdqFWzZ2sTEM3svKajyk9Lg')
    .then(response => {
        if (response.data.includes('hqdefault_live.jpg')) {
            res.json({
                isLive: true
            });
        } else {
            res.json({
                isLive: false
            });
        }
    })
    .catch(error => {
        console.log(error);
        res.send(error);
    })
})


app.listen(3000, () => {
    console.log(`Listening on port 3000.`);
})