const { helpers } = require('@kyle11231/helper-functions');
const walkRoutes = require('./walk-routes.json');

function pathfinder(startId, endId, allStops) {
    const stopsMap = new Map();
    for (let stop of allStops) {
        stopsMap.set(stop.id, stop);
        stop.pathToStop = [];
        stop.shortestTime = Infinity;
    }

    let start = stopsMap.get(startId);
    let end = stopsMap.get(endId);

    start.shortestTime = 0;

    class PathSegment {
        constructor(stop1, stop2, routes, numOfStops) {
            this.stop1 = stop1;
            this.stop2 = stop2;
            this.routes = routes;
            this.numOfStops = numOfStops;
        }
    }

    let unexploredStopIds = [];
    for (let stop of allStops) {
        unexploredStopIds.push(stop.id);
    }

    let currentStop = start;

    // dijkstra loop
    while (unexploredStopIds.length > 0) {
        let currentStopAtStartOfLoop = helpers.deepCopy(currentStop);
        unexploredStopIds = helpers.removeFromArray(unexploredStopIds, currentStop.id);

        for (adjStopWeightRoutes of currentStop.adjacentStops) {
            let adjStop = stopsMap.get(adjStopWeightRoutes.id);
            let adjStopNewTime = currentStop.shortestTime + adjStopWeightRoutes.weight;

            let transferNeeded = false;

            let hasWalkRoute = false;

            for (let walkRoute of walkRoutes.routes) {
                if (adjStopWeightRoutes.routes.includes(walkRoute)) {
                    hasWalkRoute = true;
                    break;
                }
            }

            if (currentStop.pathToStop.length > 0 && !hasWalkRoute) {
                let commonRoutes = helpers.findCommonElements(currentStop.pathToStop[currentStop.pathToStop.length - 1].routes, adjStopWeightRoutes.routes);
                if (commonRoutes.length < 1) {
                    transferNeeded = true;
                }
            }

            if (transferNeeded) {
                adjStopNewTime += 10;
            }

            if (adjStop.shortestTime > adjStopNewTime) {
                adjStop.shortestTime = adjStopNewTime;
                adjStop.pathToStop = helpers.deepCopy(currentStop.pathToStop);
                adjStop.pathToStop.push(new PathSegment(currentStop.id, adjStop.id, adjStopWeightRoutes.routes, 1));

                for (let i = 0; i < 1000; i++) {
                    let changesMade = false;
                    // keeps repeating the below for loop until either:
                    // it goes through the entire loop without making any changes, or
                    // it goes through the loop 1000 times (to prevent an infinite loop)

                    for (let i = 1; i < adjStop.pathToStop.length; i++) {
                        if (!adjStop.pathToStop[i]) {
                            break;
                        }
                        let commonRoutes = helpers.findCommonElements(adjStop.pathToStop[i].routes, adjStop.pathToStop[i - 1].routes);
                        if (commonRoutes.length > 0) {
                            adjStop.pathToStop[i].routes = commonRoutes;
                            adjStop.pathToStop[i - 1].routes = commonRoutes;
                            changesMade = true;
                        }
                    }

                    if (!changesMade) {
                        break;
                    }
                }
            }
        }

        let stopWithShortestTime = {
            shortestTime: Infinity
        }

        for (let id of unexploredStopIds) {
            let stop = stopsMap.get(id);
            if (stop.shortestTime < stopWithShortestTime.shortestTime) {
                stopWithShortestTime = stop;
            }
        }
        
        if (currentStop.id === end.id) {
            break;
        }

        currentStop = stopWithShortestTime;

        if (currentStop.id === currentStopAtStartOfLoop.id) {
            console.error(`Failed to assign new current stop after ${currentStop.id}.`)
            console.error(`start: ${start.id}`);
            console.error(`end: ${end.id}`);
            console.error(`current stop: ${currentStop.id}`)
            debugger;
            break;
        }
    }

    return end.pathToStop;
}

module.exports = { pathfinder };