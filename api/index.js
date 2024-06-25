const express = require('express');
const app = express();

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

app.listen(3000, () => {
    console.log(`Listening on port 3000.`);
})

module.exports = app;