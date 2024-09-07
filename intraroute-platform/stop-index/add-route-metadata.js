const { helpers } = require('@kyle11231/helper-functions');

function addRouteMetadata(routes, stopId, allStops, stopsMap, allRoutes, routesMap) {
  const userStop = stopsMap.get(stopId);
  
  for (let route of routes) {
    let routeData = routesMap.get(route.id);
    route.mode = routeData.mode;
    route.type = routeData.type;
    route.bullet = routeData.bullet;
    route.num = routeData.num;
    route.altText = routeData.altText;
    route.routeName = routeData.routeName;
    route.destinationId = routeData.destinationId;
    route.destinationCity = routeData.destinationCity;
    if (routeData.useFullNameIn.includes(stopId)) {
      route.destinationStopName = routeData.destinationStopName;
    } else {
      route.destinationStopName = null;
    }
    route.codeshares = helpers.deepCopy(routeData.codeshares);
    for (let routeMetadata of userStop.routes) {
      if (routeMetadata.id === route.id) {
        route.meta1 = routeMetadata.meta1;
        route.meta2 = routeMetadata.meta2;
      }
    }
  }
  
  return routes;
}