const { helpers } = require('@kyle11231/helper-functions');
const { getStopsData, getRoutesData } = require('../get-data');
const { getStopRoutes } = require('./get-stop-routes');
const { addRouteMetadata } = require('./add-route-metadata');
const { addStopMetadata } = require('./add-stop-metadata');

async function IntraRoutePlatformIndex(stopId, filters, company, returnType, database) {
    let allStops = await getStopsData(filters, company, database);
    let allRoutes = await getRoutesData(filters, company, database
    
    let stopsMap = new Map();
    let routesMap = new Map();
    
    for (let stop of allStops) {
      stopsMap.set(stop.id, stop);
    }
    
    for (let route of routesMap) {
      routesMap.set(route.id, route);
    }
    
    class Stop = {
      constructor(id, mode, city, stopName, routes) {
        this.id = id;
        this.mode = mode;
        this.city = city;
        this.stopName = stopName;
        this.routes = routes;
      }
    }
    
    let userStop = stopsMap.get(stopId);

    let routes = getStopRoutes(stopId, allStops, stopsMap);
    
    routes = addRouteMetadata(routes, stopId, allStops, stopsMap, allRoutes, routesMap);
    
    routes = addStopMetadata(routes, stopId, allStops, stopsMap);
    
    return(new Stop(stopId, userStop.mode, userStop.city, userStop.stopName, routes));
}

module.exports = { IntraRoutePlatformIndex }