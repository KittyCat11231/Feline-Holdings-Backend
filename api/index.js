require('dotenv').config();

const express = require('express');
const app = express();

const { MongoClient } = require('mongodb');
const uri = require('./atlas_uri');

const {google} = require('googleapis');

const axios = require('axios');

const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YT_API_KEY
});

const client = new MongoClient(uri);

const dbname = 'felineHoldings';
const mbsRecentVideos = client.db(dbname).collection('mbsRecentVideos');

async function connectToDatabase() {
    try {
        await client.connect();
        console.log(`Connected to the ${dbname} database.`);
    } catch (error) {
        console.error(`Error connecting to the ${dbname} database.`)
    }
}

connectToDatabase();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({"foo": "bar"});
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
    let videos;
    async function findVideos() {
        try {
            videos = await mbsRecentVideos.find().toArray();
            res.send(videos);
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }
    findVideos();
})

/*app.get('/mbs/recent-videos-legacy', (req, res) => {
    youtube.search.list({
        part: 'snippet',
        channelId: 'UCdqFWzZ2sTEM3svKajyk9Lg',
        order: 'date',
        maxResults: 5,
    })
    .then(results => {
        res.send(results.data.items);
    })
    .catch(error => {
        res.send(error);
    })
})*/

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