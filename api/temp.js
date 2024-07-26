const { routefinder } = require('../routefinder/routefinder');

app.post('/intraroute', (req, res) => {
  const filters = {
    useAir: req.body.useAir || true,
    useBahn: req.body.useBahn || true,
    useBus: req.body.useBus || true,
    useLocal: req.body.useLocal || true,
    useRail: req.body.useRail || true,
    useSail: req.body.useSail || true
  }
  
  let stopsData = [];
  let routesData = [];
  
  async function getData(stopsCollection, routesCollection) {
    let stops = await client.db(dbname).collection(stopsCollection).find({}).toArray();
    stopsData = stopsData.concat(stops);
    
    let routes = await client.db(dbname).collection(routesCollection).find({}).toArray();
    routesData = routesData.concat(routes);
  }
  
  if (filters.useAir) {
    getData('intraAirStops', 'intraAirRoutes');
  }
  if (filters.useBahn) {
    getData('intraBahnStops', 'intraBahnRoutes');
  }
  if (filters.useBus) {
    getData('intraBusStops', 'intraBusRoutes');
    getData('omegaBusStops', 'omegaBusRoutes');
  }
  if (filters.useLocal) {
    getData('irtLumevaStops', 'irtLumevaRoutes');
    getData('irtScarboroughStops', 'irtScarboroughRoutes');
  }
})