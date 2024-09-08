const helpers = require('@kyle11231/helper-functions');
const walkRoutes = require('../walk-routes.json');

function addStopMetadata(routes, stopId, allStops, stopsMap) {
  
  class Stop {
    constructor(id, city, stopName, code, mode, transfers, connections) {
      this.id = id;
      this.city = city;
      this.stopName = stopName;
      this.code = code;
      this.mode = mode;
      this.transfers = transfers;
      this.connections = connections;
    }
  }
  
  class Connection {
    constructor(stop, route) {
      this.stop = stop;
      this.route = route;
    }
  }
  
  for (let route of routes) {
    let directionKeywords = ['north', 'south', 'east', 'west', 'cw', 'ccw'];
    
    let routeIdNoDirection = route.id;
    
    for (let direction of directionKeywords) {
      if (route.id.includes(direction)) {
        routeIdNoDirection = route.id.split(direction)[0];
      }
    }
    
    let stops = [];
    
    for (let currentStopId of route.stops) {
      let stop = stopsMap.get(currentStopId);
      
      let transfers = [];
      let connections = [];
      
      for (let transferRoute of stop.routes) {
        if (!transferRoute.id.includes(routeIdNoDirection)) {
          transfers.push(transferRoute.id);
        }
      }
      
      for (let adjStop of stop.adjacentStops) {
        if (walkRoutes.routes.includes(adjStop.routes[0])) {
          connections.push(new Connection(adjStop.id, adjStop.routes[0]));
        }
      }
      
      stops.push(new Stop(stop.id, stop.city, stop.stopName, stop.code, transfers, connections));
    }
    
    route.stops = helpers.deepCopy(stops);
  }
  
  return routes;
}

module.exports = { addStopMetadata };