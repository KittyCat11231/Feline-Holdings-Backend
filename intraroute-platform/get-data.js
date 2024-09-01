const { helpers } = require('@kyle11231/helper-functions');

async function getStopsData(filters, company, database) {
    let allStops = [];

    async function pullFromDatabase(collectionName) {
        let data = await database.collection(collectionName).find().toArray();
        return data;
    }

    if (company === 'intra') {
        if (filters.useAir) {
            let data = await pullFromDatabase('intraAirStops');
            allStops = allStops.concat(data);
        }
        if (filters.useBahn) {
            let data = await pullFromDatabase('intraBahnStops');
            allStops = allStops.concat(data);
        }
        if (filters.useBus) {
            let data1 = await pullFromDatabase('intraBusStops');
            allStops = allStops.concat(data1);
            let data2 = await pullFromDatabase('omegaBusStops');
            allStops = allStops.concat(data2);
        }
        if (filters.useRail) {
            let data = await pullFromDatabase('intraRailStops');
            allStops = allStops.concat(data);
        }
        if (filters.useSail) {
            let data = await pullFromDatabase('intraSailStops');
            allStops = allStops.concat(data);
        }
        if (filters.useLocal) {
            let data1 = await pullFromDatabase('irtLumevaStops');
            allStops = allStops.concat(data1);
            let data2 = await pullFromDatabase('irtScarStops');
            allStops = allStops.concat(data2);
        }
    }

    if (company === 'bluTransit') {
        // add code for BluTransit filters
    }

    for (let stop of allStops) {
        for (let adjStop of stop.adjacentStops) {
            function removeStop() {
                stop.adjacentStops = helpers.removeFromArray(stop.adjacentStops, adjStop);
            }

            if (company === 'intra') {
                if (!filters.useAir && adjStop.id.includes('air')) {
                    removeStop();
                }
                if (!filters.useBahn && adjStop.id.includes('bahn')) {
                    removeStop();
                }
                if (!filters.useBus && (adjStop.id.includes('bus') || adjStop.id.includes('omega'))) {
                    removeStop();
                }
                if (!filters.useRail && adjStop.id.includes('rail') && !(adjStop.id.includes('railLumeva') || adjStop.id.includes('railScar'))) {
                    removeStop();
                }
                if (!filters.useSail && adjStop.id.includes('sail')) {
                    removeStop();
                }
                if (!filters.useLocal && (adjStop.id.includes('railLumeva') || adjStop.id.includes('railScar'))) {
                    removeStop();
                }
            }

            if (company === 'bluTransit') {
                // add code for BluTransit filters
            }
        }
    }

    return allStops;
}

async function getRoutesData(filters, company, database) {
    let allRoutes = [];

    async function pullFromDatabase(collectionName) {
        let data = await database.collection(collectionName).find().toArray();
        return data;
    }

    if (company === 'intra') {
        if (filters.useAir) {
            let data = await pullFromDatabase('intraAirRoutes');
            allRoutes = allRoutes.concat(data);
        }
        if (filters.useBahn) {
            let data = await pullFromDatabase('intraBahnRoutes');
            allRoutes = allRoutes.concat(data);
        }
        if (filters.useBus) {
            let data1 = await pullFromDatabase('intraBusRoutes');
            allRoutes = allRoutes.concat(data1);
            let data2 = await pullFromDatabase('omegaBusRoutes');
            allRoutes = allRoutes.concat(data2);
        }
        if (filters.useRail) {
            let data = await pullFromDatabase('intraRailRoutes');
            allRoutes = allRoutes.concat(data);
        }
        if (filters.useSail) {
            let data = await pullFromDatabase('intraSailRoutes');
            allRoutes = allRoutes.concat(data);
        }
        if (filters.useLocal) {
            let data1 = await pullFromDatabase('irtLumevaRoutes');
            allRoutes = allRoutes.concat(data1);
            let data2 = await pullFromDatabase('irtScarRoutes');
            allRoutes = allRoutes.concat(data2);
        }
    }

    if (company === 'bluTransit') {
        // add code for BluTransit filters
    }

    return allRoutes;
}

module.exports = { getStopsData, getRoutesData };