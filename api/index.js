const express = require('express');
const app = express();

require('dotenv').config();

app.get('/', (req, res) => {
    res.json({"foo": "bar"});
})

app.post('/echoback', (req, res) => {
    res.json({"firstValue": req.body.firstValue});
    res.json({"secondValue": req.body.secondValue});
})

app.listen(3000, () => {
    console.log(`Listening on port 3000.`);
})

module.exports = app;