const { helpers } = require('@kyle11231/helper-functions');
const { dijkstra } = require('./dijkstra');
const { filterPathRoutes } = require('./filter-path-routes');

function kShortestPaths(startId, endId, stopsData, numOfPaths) {
    let shortestPath = dijkstra(startId, endId, stopsData);

    // find second shortest for now

    let possiblePaths = [];

    class Path {
        constructor(path, totalWeight) {
            this.path = path;
            this.totalWeight = totalWeight;
        }
    }

    shortestPath.forEach(segment => {
        let allStops = helpers.deepCopy(stopsData);
        let stopsMap = new Map();

        allStops.forEach(stop => {
            stopsMap.set(stop.id, stop);
        })

        let spurNode = stopsMap.get(segment.stop1id);
        let nodeAfterSpur = stopsMap.get(segment.stop2id);

        let pathToSpur = [];

        shortestPath.forEach(pathToSpurSegment => {
            pathToSpur.push(pathToSpurSegment);
            if (pathToSpurSegment.stop2id === spurNode.id) {
                return;
            }
        })
        
        spurNode.adjacentStops.forEach(adjStop => {
            if (adjStop.id === nodeAfterSpur.id) {
                adjStop.weight = Infinity;
                return;
            }
        });

        let pathAfterSpur = dijkstra(spurNode.id, endId, allStops);
        let combinedPath = pathToSpur.concat(pathAfterSpur);
        let totalWeight = 0;

        combinedPath.forEach(segment => {
            totalWeight += segment.weight;
        })

        let pathWithWeight = new Path(combinedPath, totalWeight);

        possiblePaths.push(pathWithWeight);
    })

    let pathWeights = [];

    possiblePaths.forEach(path => {
        pathWeights.push(path.totalWeight);
    })

    let lowestWeight = Math.min(...pathWeights);
    let secondShortestPath;

    possiblePaths.forEach(path => {
        if (path.totalWeight === lowestWeight) {
            secondShortestPath = path;
        }
    })

    secondShortestPath = filterPathRoutes(secondShortestPath);

    return secondShortestPath;
}

module.exports = { kShortestPaths };