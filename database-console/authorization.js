const dotenv = require('dotenv');
dotenv.config({path: '../.env'});

const bcrypt = require('bcrypt');

async function isAuthorized(userKey, role) {
    let authorized = false;
    if (role === 'admin') {
        authorized = bcrypt.compare(userKey, process.env.API_KEY_ADMIN);
    } else if (role === 'bluTransit') {
        let isBlu = bcrypt.compare(userKey, process.env.API_KEY_BLUTRANSIT);
        let isAdmin = bcrypt.compare(userKey, process.env.API_KEY_ADMIN);
        if (isBlu || isAdmin) {
            authorized = true;
        }
    }
    return authorized;
}

async function requireAuth(req, res, role, callback) {
    if (!req.body.key) {
        res.status(403).send('Request must include an API key.');
    } else {
        let authorized = await isAuthorized(req.body.key, role);
        if (authorized) {
            callback();
        } else {
            res.status(403).send('Authorization failed.');
        }
    }
}

module.exports = { requireAuth };