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
      let transfersIds = [];
      let directionKeywords = ['north', 'south', 'east', 'west', 'cw', 'ccw'];
      
      for (let transferId of stop.transfers) {
        let transferIdWithoutDirection = transferId;
        for (let direction of directionKeywords) {
          if (transferId.includes(direction)) {
            transferIdWithoutDirection = transferId.split(direction)[0];
          }
        }
        if (!transfersIds.includes(transferIdWithhoutDirection)) {
          transfersIds.push(transferId);
        }
      }
      
      for (let transferId of transfersIds) {
        
      }
    }
  }
}

module.exports = { addTransferData };