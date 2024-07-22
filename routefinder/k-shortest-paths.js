const { helpers } = require('@kyle11231/helper-functions');
const { dijkstra } = require('./dijkstra');

function kShortestPaths(startId, endId, stopsData, kthShortest) {
    class PathWithWeight {
        constructor(path, totalWeight) {
            this.path = path;
            this.totalWeight = totalWeight;
        }
    }

    let shortestPath = dijkstra(startId, endId, stopsData);
    let shortestPathTotalWeight = 0;

    shortestPath.forEach(segment => {
        shortestPathTotalWeight += segment.weight;
    })

    let shortestPathWithWeight = new PathWithWeight(shortestPath, shortestPathTotalWeight);

    let paths = [shortestPathWithWeight];
    let possiblePaths = [];

    // if kthShortest is 1, it should return the shortest path.

    let allStops = helpers.deepCopy(stopsData);
    let stopsMap = new Map();

    allStops.forEach(stop => {
        stopsMap.set(stop.id, stop);
    })

    for (let k = 2; k <= kthShortest; k++) {
        let currentShortestPath = paths[paths.length - 1];

        currentShortestPath.forEach(currentSegment => {
            // need to reset the value of allStops at the start of every loop pass
            allStops = helpers.deepCopy(stopsData);
            
            spurNode = stopsMap.get(currentSegment.stop1id);
            nodeAfterSpur = stopsMap.get(currentSegment.stop2id);

            let pathToSpur = [];

            currentShortestPath.forEach(segment => {
                pathToSpur.push(segment);
                if (segment.stop2id === spurNode) {
                    return;
                }
            })

            spurNode.adjacentStops.forEach(adjStop => {
                if (adjStop.id === nodeAfterSpur.id) {
                    adjStop.weight = Infinity;
                    return;
                }
            })

            let pathAfterSpur = dijkstra(spurNode.id, endId, allStops);
            let combinedPath = pathToSpur.concat(pathAfterSpur);
            let combinedPathTotalWeight = 0;
            
            combinedPath.forEach(segment => {
                combinedPathTotalWeight += segment.weight;
            })

            possiblePaths.push(new PathWithWeight(combinedPath, combinedPathTotalWeight));
        })

        let candidatePath;
        let candidatePathWeight = Infinity;

        possiblePaths.forEach(path => {
            if (path.weight < candidatePathWeight) {
                candidatePath = path;
                candidatePathWeight = path.weight;
            }
        })

        paths.push(candidatePath);
        helpers.removeFromArray(possiblePaths, candidatePath);
    }

    return paths;
}

module.exports = { kShortestPaths };