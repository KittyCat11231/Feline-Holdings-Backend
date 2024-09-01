const { getStopsData, getRoutesData } = require('./get-data');
const { pathfinder } = require('./pathfinder');
const { combineSegments } = require('./combine-segments');
const { addMetadata } = require('./add-metadata');
const { simpleJson } = require('./simple-json');

// need scripts to:
// check start and end validity, including with given filters
// error handling if route isn't possible with given filters

async function intraRoutePlatform(startId, endId, filters, company, returnType, database) {
    let allStops = await getStopsData(filters, company, database);
    let allRoutes = await getRoutesData(filters, company, database);

    let prePath = pathfinder(startId, endId, allStops);

    let path = combineSegments(prePath);

    let pathWithMetadata = addMetadata(path, allStops, allRoutes);

    if (returnType === 'json') {
        return pathWithMetadata;
    } else if (returnType === 'simple-json') {
        // return (simpleJson(pathWithMetadata));
        return 'coming soon';
    } else if (returnType === 'plain-text') {
        return 'coming soon';
    }
}

module.exports = { intraRoutePlatform };