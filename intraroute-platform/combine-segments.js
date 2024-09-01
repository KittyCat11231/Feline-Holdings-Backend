const { helpers } = require('@kyle11231/helper-functions');

function combineSegments(path) {
    for (let i = 0; i < (path.length - 1);) {
        if (helpers.deepEqual(path[i].routes, path[i + 1].routes)) {
            path[i].stop2 = path[i + 1].stop2;
            path[i].numOfStops++;
            path = helpers.removeFromArray(path, path[i + 1]);
        } else {
            i++;
        }
    }

    return path;
}

module.exports = { combineSegments };