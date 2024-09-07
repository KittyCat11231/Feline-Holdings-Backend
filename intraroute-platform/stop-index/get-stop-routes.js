function getStopRoutes(stopId, allStops, stopsMap) {
    class Route {
      constructor(id, stops) {
        this.id = id;
        this.stops = stops;
      }
    }
    
    let userStop = stopsMap.get(stopId);
    
    let routes = [];
    
    for (let route of userStop.routes) {
      let stops = [];
      
      let currentStop = userStop;

      for (let i = 0; i < 200; i++) {
        let breakLoop = true;
        for (let adjStop of currentStop.adjacentStops) {
            if (adjStop.routes.includes(route.id)) {
                stops.push(adjStop.id);
                breakLoop = false;
                currentStop = stopsMap.get(adjStop.id);
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

module.exports = { getStopRoutes };