require('dotenv').config();
const { helpers } = require('@kyle11231/helper-functions');

const { MongoClient } = require('mongodb');
const uri = require('../atlas_uri');

const client = new MongoClient(uri);

const dbname = 'felineHoldings';

const { kShortestPaths } = require('./k-shortest-paths');
const { dijkstra } = require('./dijkstra');
const { filterPathRoutes } = require('./filter-path-routes');
const { findBestPath } = require('./find-best-path');

async function connectToDatabase() {
    try {
        await client.connect();
        console.log(`Connected to the ${dbname} database.`);
    } catch (error) {
        console.error(`Error connecting to the ${dbname} database.`);
        console.error(error);
    }
}

async function routefinder() {
    try {
        let collection = client.db(dbname).collection('intraRailStops');
        let stopsData = await collection.find({}).toArray();
        stopsData.forEach(stop => {
            stop.adjacentStops.forEach(adjStop => {
                if (!(adjStop.id.includes('rail')) || adjStop.id.includes('railLumeva') || adjStop.id.includes('railScar')) {
                    stop.adjacentStops = helpers.removeFromArray(stop.adjacentStops, adjStop);
                }
            })
        })
        console.log(new Date());
        let paths = kShortestPaths('railASN', 'railSSR', stopsData, 30);
        let path = findBestPath(paths);
        console.log(path);
        console.log(new Date());
    } catch (error) {
        console.error(error);
    }
}

connectToDatabase().then(routefinder());