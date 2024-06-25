const express = require('express');
const app = express();

require('dotenv').config();

app.get('/', (req, res) => {
    res.send('Express on Vercel');
})

app.listen(3000, () => {
    console.log(`Listening on port 3000.`);
})

module.exports = app;