const { helpers } = require('@kyle11231/helper-functions');

function buildStopData(stopId, allStops) {
    class Route {
      constructor(id, meta1, meta2, stops) {
        this.id = id;
        this.meta1 = meta1;
        this.meta2 = meta2;
        this.stops = stops;
      }
    }
    
    let stopsMap = new Map();
    
    for (let stop of allStops) {
      stopsMap.set(stop.id, stop);
    }
    
    let userStop = stopsMap.get(stopId);
    
    let routes = [];
    
    for (let route of userStop.routes) {
      let stops = [];
      routes.push(new Route(route.id, route.meta1, route.meta2, stops))
    }
}

module.exports = { buildStopData };