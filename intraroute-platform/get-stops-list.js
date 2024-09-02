const { helpers } = require('@kyle11231/helper-functions');

async function getStopsList(filters, company, database) {
    class Stop {
        constructor(id, name, keywords) {
            this.id = id;
            this.name = name;
            this.keywords = keywords;
        }
    }
    let stopNames = [];

    async function pullFromDatabase(collectionName, modeDisplayName) {
        let rawData = await database.collection(collectionName).find().toArray();
        let finalData = [];
        for (let rawStop of rawData) {
            let name;
            if (helpers.isNull(rawStop.stopName)) {
                name = `${rawStop.city} (${rawStop.code}) (${modeDisplayName})`;
            } else {
                name = `${rawStop.city} ${rawStop.stopName} (${rawStop.code}) (${modeDisplayName})`;
            }
            let keywords = name;
            if (rawStop.keywords.length > 0) {
                for (let keyword of rawStop.keywords) {
                    keywords = keywords.concat(` ${keyword}`);
                }
            }
            finalData.push(new Stop(rawStop.id, name, keywords))
        }
        return finalData;
    }

    if (company === 'intra') {
        if (filters.useAir) {
            let data = await pullFromDatabase('intraAirStops', 'IntraAir');
            stopNames = stopNames.concat(data);
        }
        if (filters.useBahn) {
            let data = await pullFromDatabase('intraBahnStops', 'IntraBahn');
            stopNames = stopNames.concat(data);
        }
        if (filters.useBus) {
            let data1 = await pullFromDatabase('intraBusStops', 'IntraBus');
            stopNames = stopNames.concat(data1);
            let data2 = await pullFromDatabase('omegaBusStops', 'OMEGAbus!');
            stopNames = stopNames.concat(data2);
        }
        if (filters.useRail) {
            let data = await pullFromDatabase('intraRailStops', 'IntraRail');
            stopNames = stopNames.concat(data);
        }
        if (filters.useSail) {
            let data = await pullFromDatabase('intraSailStops', 'IntraSail');
            stopNames = stopNames.concat(data);
        }
        if (filters.useLocal) {
            let data1 = await pullFromDatabase('irtLumevaStops', 'IRT Lumeva El');
            stopNames = stopNames.concat(data1);
            let data2 = await pullFromDatabase('irtScarStops', 'IRT Scarborough Metro');
            stopNames = stopNames.concat(data2);
        }
    }
    
    return stopNames;
}

module.exports = { getStopsList };