const constants = require('./constants');
const scraper = require('./controllers/scraper');
const reporter = require('./controllers/reporter');

// Start all scrapers at once, then wait till all are finished and report on each location in order
Promise.all(constants.locations.map(location => {
   let url = constants.websiteTemplate.replace("{location}", location);
   return scraper.initScraper(location, url);
})).then(locationResult => {
   reporter.startReport();
   locationResult.forEach(results => {
      reporter.reportTideResults(results);
   });
});
