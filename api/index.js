require('dotenv').config();

const express = require('express');
const app = express();

const {google} = require('googleapis');

const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YT_API_KEY
});

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
    youtube.search.list({
        part: 'snippet',
        channelId: 'UCdqFWzZ2sTEM3svKajyk9Lg',
        order: 'date',
        maxResults: 10,
    })
    .then(results => {
        res.send(results.data.items);
    })
    .catch(error => {
        res.send(error)
    })
})

app.listen(3000, () => {
    console.log(`Listening on port 3000.`);
})