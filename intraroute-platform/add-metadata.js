const walkRoutes = require('./walk-routes.json');

function addMetadata(inputPath, allStops, allRoutes) {
    class PathSegment {
        constructor(stop1, stop2, route, numOfStops) {
            this.stop1 = stop1;
            this.stop2 = stop2;
            this.route = route;
            this.numOfStops = numOfStops;
        }
    }

    class Stop {
        constructor(id, city, stopName, mode, code, meta1, meta2) {
            this.id = id;
            this.city = city;
            this.stopName = stopName;
            this.mode = mode;
            this.code = code;
            this.meta1 = meta1;
            this.meta2 = meta2;
        }
    }

    const stopsMap = new Map();
    const routesMap = new Map();

    for (let stop of allStops) {
        stopsMap.set(stop.id, stop);
    }
    for (let route of allRoutes) {
        routesMap.set(route.id, route);
    }

    let outputPath = [];

    for (let segment of inputPath) {
        let stop1data = stopsMap.get(segment.stop1);
        let stop2data = stopsMap.get(segment.stop2);
        let routeData;

        let stop1meta1 = null;
        let stop1meta2 = null;

        let stop2meta1 = null;
        let stop2meta2 = null;

        if (!walkRoutes.routes.includes(segment.routes[0])) {
            routeData = routesMap.get(segment.routes[0]);
            delete routeData._id;

            if (!routeData.useFullNameIn.includes(segment.stop1)) {
                routeData.destinationStopName = null;
            }

            
            delete routeData.useFullNameIn;

            for (let route of stop1data.routes) {
                if (route.id === routeData.id) {
                    stop1meta1 = route.meta1;
                    stop1meta2 = route.meta2;
                }
            }
    
            for (let route of stop2data.routes) {
                if (route.id === routeData.id) {
                    stop2meta1 = route.meta1;
                    stop2meta2 = route.meta2;
                }
            }
        } else {
            routeData = { id: segment.routes[0] };
        }

        let stop1withMeta = new Stop(stop1data.id, stop1data.city, stop1data.stopName, stop1data.mode, stop1data.code, stop1meta1, stop1meta2);
        let stop2withMeta = new Stop(stop2data.id, stop2data.city, stop2data.stopName, stop2data.mode, stop2data.code, stop2meta1, stop2meta2);

        outputPath.push(new PathSegment(stop1withMeta, stop2withMeta, routeData, segment.numOfStops));
    }

    return outputPath;
}

module.exports = { addMetadata };