const dotenv = require('dotenv');
dotenv.config({path: '../.env'});

const express = require('express');
const app = express();

const cors = require('cors');

app.use(cors({
    origin: ['https://felineholdings.com', 'https://console.felineholdings.com']
}));

const { MongoClient } = require('mongodb');
const uri = require('../atlas_uri');

const axios = require('axios');

const client = new MongoClient(process.env.MONGODB_URI, {
    connectTimeoutMS: 100000,
});

const { updateIntraRoute } = require('../database-console/update-intraroute');

const dbname = 'felineHoldings';

const mongoSanitize = require('express-mongo-sanitize');

async function connectToDatabase() {
    try {
        await client.connect();
        console.log(`Connected to the ${dbname} database.`);
    } catch (error) {
        console.error(`Error connecting to the ${dbname} database.`)
        console.error(error);
        connectToDatabase();
    }
}

connectToDatabase();

const { requireAuth } = require('../database-console/authorization');
const { getCollectionNames, getCollectionData } = require('../database-console/search');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('You have reached the API of Feline Holdings!')
})

app.get('/echoback', (req, res) => {
    res.json({
        "firstValue": req.query.firstValue,
        "secondValue": req.query.secondValue
    })
})

app.get('/intraroute', (req, res) => {
    if (req.query.start && req.query.end) {
        res.send(`Once IntraRoute's API is complete, this request will return a route from ${req.query.start} to ${req.query.end}`);
    } else {
        res.send('IntraRoute API coming soon.')
    }
})

app.get('/mbs/recent-videos', (req, res) => {
    const mbsRecentVideos = client.db(dbname).collection('mbsRecentVideos');
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

app.post('/protected/admin', (req, res) => {
    requireAuth(req, res, 'admin', () => {
        res.status(200).send('Authentication accepted!');
    })
})

app.post('/protected/blutransit', (req, res) => {
    requireAuth(req, res, 'bluTransit', () => {
        res.status(200).send('Authentication accepted!');
    })
})

app.post('/database/intraroute', (req, res) => {
  requireAuth(req, res, 'admin', () => {
    updateIntraRoute(client, res);
  })
})

app.listen(3000, () => {
    console.log(`Listening on port 3000.`);
})