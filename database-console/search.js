const { returnRole } = require('./authorization');
const permissions = require('./permissions.json');

async function getCollectionNames(userKey, database) {
    let role = await returnRole(userKey);
    let collections = await database.listCollections().toArray();
    let collectionNames = [];

    collections.forEach(collection => {
        collectionNames.push(collection.name);
    })

    if (role === 'admin') {
        return collectionNames;
    } else if (role === 'bluTransit') {
        return collectionNames.filter(collection => permissions.bluTransit.collections.includes(collection));
    } else {
        return null;
    }
}

async function getCollectionData(userKey, collectionName, database) {
    let role = await returnRole(userKey);
    if (role === 'admin') {
        console.log('');
    }
}

module.exports = { getCollectionNames, getCollectionData };