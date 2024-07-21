const { helpers } = require('@kyle11231/helper-functions');
const { dijkstra } = require('./dijkstra');

function kShortestPaths(startId, endId, stopsData) {
    let shortestPath = dijkstra(startId, endId, stopsData);

    let allPaths = []

    shortestPath.forEach(spurPointSegment => {
        let allStops = helpers.deepCopy(stopsData);
        let stopsMap = new Map();

        allStops.forEach(stop => {
            stopsMap.set(stop.id, stop);
        })

        let spurPoint = stopsMap.get(spurPointSegment.stop1id);

        spurPoint.adjacentStops.forEach(stop => {
            if (stop.id === spurPointSegment.stop2id) {
                stop.weight = Infinity;
            }
        })

        let pathToSpur = [];

        shortestPath.forEach(segment => {
            if (segment.stop1id === spurPoint.id) {
                return;
            } else {
                pathToSpur.push(segment);
            }
        })

        let pathAfterSpur = dijkstra(spurPoint.id, endId, allStops);
        let path = pathToSpur.concat(pathAfterSpur);
        allPaths.push(path);
    })

    return allPaths;
}

module.exports = { kShortestPaths };