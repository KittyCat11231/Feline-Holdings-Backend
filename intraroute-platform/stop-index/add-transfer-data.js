const { helpers } = require('@kyle11231/helper-functions');

function addTransferData(routes, allRoutes, routesMap) {
  class Transfer {
    constructor(ids, mode, type, bullet, num, altText, routeName, codeshares) {
      this.ids = ids;
      this.mode = mode;
      this.type = type;
      this.bullet = bullet;
      this.num = num;
      this.altText = altText;
      this.routeName = routeName;
      this.codeshares = codeshares;
    }
  }
  
  for (let route of routes) {
    for (let stop of routes.stops) {
      let transfers = [];
      
      for (let transferId of stop.transfers) {
        let transferRoute = routesMap.get(transferId);
        
        transfers.push(new Transfer([transferId], transferRoute.mode, transferRoute.type, transferRoute.bullet, transferRoute.num, transferRoute.altText, transferRoute.routeName, transferRoute.codeshares));
      }
      
      for (let i = 0; i < (transfers.length - 1);) {
        let directionKeywords = ['north', 'south', 'east', 'west', 'cw', 'ccw'];
        
        let idNoKeyword = transfers[i].ids[0];
        
        for (let direction of directionKeywords) {
          if (idNoKeyword.includes(direction)) {
            idNoKeyword = idNoKeyword.split(direction)[0];
          }
        }
        
        if (transfers[i + 1].ids[0].includes(idNoKeyword)) {
          transfers[i].ids = transfers[i].ids.concat(transfers[i + 1].ids);
          transfers = helpers.removeFromArray(transfers[i + 1]);
        } else {
          i++;
        }
      }
      stop.transfers = transfers;
    }
  }
  return routes;
}

module.exports = { addTransferData };