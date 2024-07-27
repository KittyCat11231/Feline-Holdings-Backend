const { helpers } = require('@kyle11231/helper-functions');

function filterPathRoutes(path) {
    // the while loop will keep repeating until the for loop iterates through the entire path without making any changes
    while (true) {
        let repeatWhileLoop = false;
        for (let i = 1; i < path.length; i++) {
            let commonRoutes = helpers.findCommonElements(path[i].routesIds, path[i - 1].routesIds);
            if (commonRoutes.length > 0 && !(helpers.deepEqual(path[i].routesIds, path[i - 1].routesIds))) {
                path[i].routesIds = commonRoutes;
                path[i - 1].routesIds = commonRoutes;
                repeatWhileLoop = true;
            }
        }

        if (repeatWhileLoop === false) {
            break;
        }
    }

    for (let i = 0; i < (path.length - 1);) {
        if (helpers.deepEqual(path[i].routesIds, path[i + 1].routesIds)) {
            path[i].stop2id = path[i + 1].stop2id;
            path[i].stopCount++;
            path[i].weight += path[i + 1].weight;
            path = helpers.removeFromArray(path, path[i + 1]);
        } else {
            i++;
        }
    }

    return path;
}

module.exports = { filterPathRoutes };