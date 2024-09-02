const { helpers } = '@kyle11231/helper-functions'

function simpleJson(inputPath) {
    class PathSegment {
        constructor(stop1, stop2, route, towards, numOfStops) {
            this.stop1 = stop1;
            this.stop2 = stop2;
            this.route = route;
            this.towards = towards;
            this.numOfStops = numOfStops;
        }
    }

    class Stop {
        constructor(stopName, code, meta1, meta2) {
            this.stopName = stopName;
            this.code = code;
            this.meta1 = meta1;
            this.meta2 = meta2;
        }
    }

    let modeNames = new Map();
    modeNames.set('air', 'IntraAir');
    modeNames.set('bahn', 'IntraBahn');
    modeNames.set('bus', 'IntraBus');
    modeNames.set('omega', 'OMEGAbus!');
    modeNames.set('rail', 'IntraRail');
    modeNames.set('sail', 'IntraSail');
    modeNames.set('railScar', 'IRT Scarborough Metro');
    modeNames.set('railLumeva', 'IRT Lumeva El');

    let outputPath = [];

    for (let segment of inputPath) {
        let stop1stopName;
        if (!helpers.isNull(segment.stop1.stopName)) {
            stop1stopName = `${segment.stop1.city} ${segment.stop1.stopName} (${modeNames.get(segment.stop1.mode)})`;
        } else {
            stop1stopName = `${segment.stop1.city} (${modeNames.get(segment.stop1.mode)})`;
        }

        let stop2stopName;
        if (!helpers.isNull(segment.stop2.stopName)) {
            stop2stopName = `${segment.stop2.city} ${segment.stop2.stopName} (${modeNames.get(segment.stop2.mode)})`;
        } else {
            stop2stopName = `${segment.stop2.city} (${modeNames.get(segment.stop2.mode)})`;
        }

        let stop1 = new Stop(stop1stopName, segment.stop1.code, segment.stop1.meta1, segment.stop1.meta2);
        let stop2 = new Stop(stop2stopName, segment.stop2.code, segment.stop2.meta1, segment.stop2.meta2);

        let routeName;
        if (segment.route.mode === 'air' && segment.route.type === 'mainline') {
            let num = segment.route.id.split('air')[1];
            routeName = `IntraAir Flight ${num}`;
        } else if (segment.route.mode === 'air' && segment.route.type === 'segville') {
            let num = segment.route.id.split('seg')[1];
            routeName = `Segville Air Flight ${num}`;
        } else if (segment.route.mode === 'air' && segment.route.type === 'waypoint') {
            let num = segment.route.id.split('wp')[1];
            routeName = `Waypoint Flight ${num}`;
        } else if (segment.route.mode === 'air' && segment.route.type === 'waypointHopper') {
            let num = segment.route.id.split('wp')[1];
            routeName = `Waypoint Hopper Flight ${num}`;
        } else if (segment.route.mode === 'air' && segment.route.type === 'volanti') {
            let num = segment.route.id.split('volanti')[1];
            routeName = `Italiani Volanti Flight ${num}`;
        } else if (segment.route.mode === 'air' && segment.route.type === 'skywest') {
            let num = segment.route.id.split('skywest')[1];
            routeName = `SkyWest Airlines Flight ${num}`;
        } else if (segment.route.mode === 'air' && segment.route.type.includes('gems')) {
            let num = segment.route.id.split('gems')[1];
            routeName = `GEMS Airline Flight ${num}`;
        } else if (segment.route.mode === 'air' && segment.route.type === 'heli') {
            let num = segment.route.id.split('heli')[1];
            routeName = `IntraAir Heli Lines Flight ${num}`;
        } else if (segment.route.mode === 'air' && segment.route.type === 'segHeli') {
            let num = segment.route.id.split('segHeli')[1];
            routeName = `Segville Air Heli Lines Flight ${num}`;
        } else if (segment.route.mode === 'air' && segment.route.type === 'heampstead') {
            let num = segment.route.id.split('heamp')[1];
            routeName = `Heampstead Charter Flight ${num}`;
        } else if (segment.route.mode === 'air' && segment.route.type === 'eastern') {
            let num = segment.route.id.split('eastern')[1];
            routeName = `Eastern Airways Heli Lines Flight ${num}`;
        } else if (segment.route.mode === 'air' && segment.route.type === 'poseidon') {
            let num = segment.route.id.split('poseidon')[1];
            routeName = `IntraAir Poseidon Flight ${num}`;
        } else if (segment.route.mode === 'bahn') {
            let num = segment.route.altText.split('IntraBahn ')[1];
            if (num.includes('X')) {
                routeName = `IntraBahn <${num}> ${segment.route.routeName}`;
            } else {
                routeName = `IntraBahn (${num}) ${segment.route.routeName}`;
            }
        } else if (segment.route.mode === 'bus') {
            routeName = `IntraBus ${segment.route.num}`;
        } else if (segment.route.mode === 'omega') {
            routeName = `OMEGABUS! ${segment.route.num}`;
        } else if (segment.route.mode === 'rail' && segment.route.type !== 'mcr') {
            let num = segment.route.altText.split('IntraRail ')[1];
            routeName = `MCR (${num}) ${segment.route.routeName}`;
            if (routeName === 'IntraRail (66X) East Mesan Express') {
                routeName = 'IntraRail <66> East Mesan Express';
            }
        } else if (segment.route.mode === 'rail' && segment.route.type === 'mcr') {
            let num = segment.route.altText.split('MCR ')[1];
            routeName = `MCR (${num}) ${segment.route.routeName}`;
        } else if (segment.route.mode === 'sail') {
            routeName = `IntraSail [ ${num} ] ${segment.route.routeName}`;
        } else if (segment.route.mode === 'railScar') {
            routeName = `IRT Scarborough Metro ${num} ${segment.route.routeName}`;
        } else if (segment.route.mode === 'railLumeva') {
            routeName = `IRT Lumeva El ${num} ${segment.route.routeName}`;
        }

        let destination;
        if (!helpers.isNull(segment.route.destinationStopName)) {
            destination = `${segment.route.destinationCity} ${segment.route.destinationStopName}`;
        } else {
            destination = segment.route.destinationCity;
        }

        outputPath.push(new PathSegment(stop1, stop2, routeName, destination, segment.numOfStops));
    }

    return outputPath;
}

module.exports = { simpleJson };