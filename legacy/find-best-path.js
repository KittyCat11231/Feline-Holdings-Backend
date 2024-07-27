const { helpers } = require('@kyle11231/helper-functions');

function findBestPath(paths) {
    for (let pathWithWeight of paths) {
        for (let i = 1; i < pathWithWeight.path.length; i++) {
            if (!(helpers.deepEqual(pathWithWeight.path[i].routesIds, pathWithWeight.path[i - 1].routesIds))) {
                pathWithWeight.weight += 10;
            }
        }
    }

    let candidatePath;
    let candidatePathWeight = Infinity;

    for (let pathWithWeight of paths) {
        if (pathWithWeight.weight < candidatePathWeight) {
            candidatePath = pathWithWeight;
            candidatePathWeight = pathWithWeight.weight;
        }
    }

    return candidatePath.path;
}

module.exports = { findBestPath };