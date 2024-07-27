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

    let stopsMap = new Map();

    for (let k = 2; k <= kthShortest; k++) {
        let currentShortestPath = paths[paths.length - 1];

        for (let currentSegment of currentShortestPath.path) {
            // need to reset the value of allStops at the start of every loop pass
            let allStops = helpers.deepCopy(stopsData);

            allStops.forEach(stop => {
                stopsMap.set(stop.id, stop);
            })

            spurNode = stopsMap.get(currentSegment.stop1id);
            nodeAfterSpur = stopsMap.get(currentSegment.stop2id);

            let pathToSpur = [];

            if (startId !== spurNode.id) {
                for (let segment of currentShortestPath.path) {
                    pathToSpur.push(segment);
                    if (segment.stop2id === spurNode.id) {
                        break;
                    }
                }
            }

            let deadEnd = false;

            for (let adjStop of spurNode.adjacentStops) {
                if (adjStop.id === nodeAfterSpur.id && spurNode.adjacentStops.length > 1) {
                    spurNode.adjacentStops = helpers.removeFromArray(spurNode.adjacentStops, adjStop);
                    break;
                } else if (adjStop.id === nodeAfterSpur.id && spurNode.adjacentStops.length === 1) {
                    deadEnd = true;
                    break;
                }
            }

            if (deadEnd === true) {
                continue;
            }

            let pathAfterSpur = dijkstra(spurNode.id, endId, allStops);
            if (pathAfterSpur.length === 0) {
                continue;
            }
            
            let combinedPath;

            if (pathToSpur.length > 0) {
                combinedPath = pathToSpur.concat(pathAfterSpur);
            } else {
                combinedPath = pathAfterSpur;
            }

            let combinedPathTotalWeight = 0;
            
            combinedPath.forEach(segment => {
                combinedPathTotalWeight += segment.weight;
            })

            let possiblePath = new PathWithWeight(combinedPath, combinedPathTotalWeight);

            let alreadyInPossiblePaths = false;

            possiblePaths.forEach(path => {
                if (helpers.deepEqual(path.path, possiblePath.path)) {
                    alreadyInPossiblePaths = true;
                }
            })

            if (alreadyInPossiblePaths === false) {
                possiblePaths.push(possiblePath);
            }
        }

        let candidatePath;
        let candidatePathWeight = Infinity;

        for (let path of possiblePaths) {
            if (path.totalWeight < candidatePathWeight) {
                let alreadyInPaths = false;
                for (let pathFromPathsArray of paths) {
                    if (helpers.deepEqual(path.path, pathFromPathsArray.path)) {
                        alreadyInPaths = true;
                        break;
                    }
                }
                if (alreadyInPaths === false) {
                    candidatePath = path;
                    candidatePathWeight = path.totalWeight;
                } else {
                    possiblePaths = helpers.removeFromArray(possiblePaths, path);
                }
            }
        }

        paths.push(candidatePath);
        helpers.removeFromArray(possiblePaths, candidatePath);
    }

    return paths;
}

module.exports = { kShortestPaths };