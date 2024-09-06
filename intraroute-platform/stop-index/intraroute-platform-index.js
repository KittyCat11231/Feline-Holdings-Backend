const { helpers } = require('@kyle11231/helper-functions');
const { getStopsData, getRoutesData } = require('../get-data');

async function IntraRoutePlatformIndex(stopId, filters, company, returnType, database) {
    let allStops = await getStopsData(filters, company, database);
    let allRoutes = await getRoutesData(filters, company, database);

    
}

module.exports = { IntraRoutePlatformIndex }