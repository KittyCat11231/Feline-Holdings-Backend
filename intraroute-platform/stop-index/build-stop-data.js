function buildStopData(stopId, allStops) {
    class Route {
      constructor(id, stops) {
        this.id = id;
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
      
      let currentStop = userStop;

      for (let i = 0; i < 200; i++) {
        let breakLoop = true;
        for (let adjStop in currentStop.adjacentStops) {
            if (adjStop.routes.includes(route.id)) {
                stops.push(adjStop.id);
                breakLoop = false;
                currentStop = stopsMap.get(adjStop);
                break;
            }
        }
        if (breakLoop) {
            break;
        }
      }

      routes.push(new Route(route.id, stops))
    }

    return routes;
}

module.exports = { buildStopData };