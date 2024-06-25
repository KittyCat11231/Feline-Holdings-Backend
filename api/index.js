require('dotenv').config();

const express = require('express');
const app = express();

const {google} = require('googleapis');

const axios = require('axios');

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
        res.send(error);
    })
})

app.get('/mbs/live-now', (req, res) => {
    axios.get('https://www.youtube.com/channel/UCdqFWzZ2sTEM3svKajyk9Lg')
    .then(response => {
        if (response.data.includes('hqdefault_live.jpg')) {
            res.send('true');
        } else {
            res.send('false');
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