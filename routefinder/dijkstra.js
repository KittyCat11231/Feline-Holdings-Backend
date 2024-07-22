const { helpers } = require('@kyle11231/helper-functions');

function dijkstra(startId, endId, stopsData) {
    let stopsMap = new Map();
    let unexploredStops = [];

    let allStops = helpers.deepCopy(stopsData);

    allStops.forEach(stop => {
        stopsMap.set(stop.id, stop);
        stop.shortestTime = Infinity;
        stop.path = [];
        unexploredStops.push(stop);
    })

    class PathSegment {
        constructor(stop1id, stop2id, routesIds, stopCount) {
            this.stop1id = stop1id;
            this.stop2id = stop2id;
            this.routesIds = routesIds;
            this.stopCount = stopCount;
        }
    }

    let start = stopsMap.get(startId);
    let end = stopsMap.get(endId);

    start.shortestTime = 0
    let currentStop = start;

    while (unexploredStops.length > 0) {
        let currentStopAtStartOfLoop = currentStop;

        currentStop.adjacentStops.forEach(stop => {
            // "adjStop" and "stop" refer to the same stop
            // "adjStop" is for the stop from the main dataset
            // "stop" is for the stop from currentStop.adjacentStops

            let adjStop = stopsMap.get(stop.id);
            let adjStopNewTime = currentStop.shortestTime + stop.weight;

            let adjStopPathLastLeg = new PathSegment(currentStop.id, stop.id, stop.routes, 1);
            
            if (adjStopNewTime < adjStop.shortestTime) {
                adjStop.path = currentStop.path;
                adjStop.shortestTime = adjStopNewTime;
                adjStop.path.push(adjStopPathLastLeg);
            }
        });

        unexploredStops = helpers.removeFromArray(unexploredStops, currentStop);

        let unexploredShortestTimes = [];

        unexploredStops.forEach(stop => {
            unexploredShortestTimes.push(stop.shortestTime);
        });

        let unexploredShortestTimeMin = Math.min(...unexploredShortestTimes);

        unexploredStops.forEach(stop => {
            if (stop.shortestTime === unexploredShortestTimeMin) {
                currentStop = stop;
                return;
            }
        })

        if (currentStop === end) {
            break;
        }

        if (currentStop.id === currentStopAtStartOfLoop.id) {
            console.error('New current stop assignment failed.', 'currentStop:', currentStop, 'allStops', allStops);
            break;
        }
    }

    let path = helpers.deepCopy(end.path);

    for (let i = 0; i < (path.length - 1);) {
        if (helpers.deepEqual(path[i].routesIds, path[i + 1].routesIds)) {
            path[i].stop2id = path[i + 1].stop2id;
            path[i].stopCount += 1;
            path = helpers.removeFromArray(path, path[i + 1]);
        } else {
            i++;
        }
    }

    return path;
}

module.exports = { dijkstra };