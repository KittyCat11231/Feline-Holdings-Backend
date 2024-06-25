const express = require('express');
const app = express();
const port = 4000;

require('dotenv').config();

app.get('/', (req, res) => {
    res.send('Request successful!');
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}.`);
})

run().catch(console.dir);