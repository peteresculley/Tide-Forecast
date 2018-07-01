process.env.NODE_TEST = true;

const assert = require('assert');

const constants = require('../constants');
const reporter = require('../controllers/reporter');
const fetchMock = require('fetch-mock');
const fs = require('fs');
const scraper = require('../controllers/scraper');

describe('Constants', function() {
   it('locations should be an array of strings', function() {
      assert.ok(constants.locations instanceof Array, 'locations should be array');
      if(constants.locations.length > 0) {
         assert.strictEqual(typeof constants.locations[0], 'string', 'each location should be string');
      }
   });
   it('websiteTemplate should be a string containing "{location}"', function() {
      assert.strictEqual(typeof constants.websiteTemplate, 'string', 'should be string');
      assert.ok(constants.websiteTemplate.includes('{location}'), 'should include "{location}"');
   });
});

describe('Reporter', function () {
   describe('#startReport()', function () {
      it('should print to console', function () {
         const tempLog = console.log;
         console.log = function (log) {
            assert.equal(log, 'Daylight low tides within the next 7 days:\n');
         };
         reporter.startReport();
         console.log = tempLog;
      });
   });

   describe('#makeLocationReadable(location)', function () {
      it('should replace dashes with spaces', function () {
         assert.equal(reporter.makeLocationReadable('should-replace-dashes-with-spaces'), 'should replace dashes with spaces');
      });
   });

   describe('#reportTideResults(results)', function () {
      it('should print to console', function () {
         const tempLog = console.log;
         let logged = [];
         console.log = function (log) {
            logged.push(log);
         };
         reporter.reportTideResults({ location: 'test-location', data: [{ date: 'date', time: 'time', tideLevel: 'tideLevel' }] });
         assert.deepEqual(logged, ['test location', 'date                time            tideLevel', undefined]);
         console.log = tempLog;
      });
   });
});

describe('Scraper', function () {
   describe('#initScraper(location, url)', function () {
      it('should fetch on url', function (done) {
         let location = 'Half-Moon-Bay-California';
         let url = constants.websiteTemplate.replace('{location}', location);
         fetchMock.mock(url, fs.readFileSync('test/Half-Moon-Bay-California.html'));
         scraper.initScraper(location, url).then(results => {
            assert.deepStrictEqual(results,
               {
                  location: location,
                  data: [
                     { date: 'Thursday 28 June', time: ' 5:30 PM PDT', tideLevel: '(2.90 feet)' },
                     { date: 'Friday 29 June', time: ' 6:17 AM PDT', tideLevel: '(-0.66 feet)' },
                     { date: 'Friday 29 June', time: ' 6:09 PM PDT', tideLevel: '(2.98 feet)' },
                     { date: 'Saturday 30 June', time: ' 6:51 AM PDT', tideLevel: '(-0.57 feet)' },
                     { date: 'Saturday 30 June', time: ' 6:51 PM PDT', tideLevel: '(3.03 feet)' },
                     { date: 'Sunday 1 July', time: ' 7:26 AM PDT', tideLevel: '(-0.41 feet)' },
                     { date: 'Sunday 1 July', time: ' 7:35 PM PDT', tideLevel: '(3.04 feet)' },
                     { date: 'Monday 2 July', time: ' 8:03 AM PDT', tideLevel: '(-0.20 feet)' },
                     { date: 'Monday 2 July', time: ' 8:26 PM PDT', tideLevel: '(2.99 feet)' },
                     { date: 'Tuesday 3 July', time: ' 8:42 AM PDT', tideLevel: '(0.08 feet)' },
                     { date: 'Wednesday 4 July', time: ' 9:24 AM PDT', tideLevel: '(0.42 feet)' },
                     { date: 'Thursday 5 July', time: '10:09 AM PDT', tideLevel: '(0.81 feet)' },
                     { date: 'Friday 6 July', time: '10:58 AM PDT', tideLevel: '(1.23 feet)' },
                     { date: 'Saturday 7 July', time: '11:52 AM PDT', tideLevel: '(1.63 feet)' },
                     { date: 'Sunday 8 July', time: '12:48 PM PDT', tideLevel: '(1.98 feet)' },
                     { date: 'Monday 9 July', time: ' 1:44 PM PDT', tideLevel: '(2.25 feet)' },
                     { date: 'Tuesday 10 July', time: ' 2:40 PM PDT', tideLevel: '(2.42 feet)' },
                     { date: 'Wednesday 11 July', time: ' 3:34 PM PDT', tideLevel: '(2.49 feet)' },
                     { date: 'Thursday 12 July', time: ' 4:27 PM PDT', tideLevel: '(2.49 feet)' },
                     { date: 'Friday 13 July', time: ' 5:21 PM PDT', tideLevel: '(2.43 feet)' },
                     { date: 'Saturday 14 July', time: ' 6:18 AM PDT', tideLevel: '(-1.60 feet)' },
                     { date: 'Saturday 14 July', time: ' 6:17 PM PDT', tideLevel: '(2.35 feet)' },
                     { date: 'Sunday 15 July', time: ' 7:05 AM PDT', tideLevel: '(-1.35 feet)' },
                     { date: 'Sunday 15 July', time: ' 7:16 PM PDT', tideLevel: '(2.24 feet)' },
                     { date: 'Monday 16 July', time: ' 7:54 AM PDT', tideLevel: '(-0.93 feet)' },
                     { date: 'Monday 16 July', time: ' 8:19 PM PDT', tideLevel: '(2.11 feet)' },
                     { date: 'Tuesday 17 July', time: ' 8:43 AM PDT', tideLevel: '(-0.36 feet)' },
                     { date: 'Wednesday 18 July', time: ' 9:34 AM PDT', tideLevel: '(0.28 feet)' },
                     { date: 'Thursday 19 July', time: '10:27 AM PDT', tideLevel: '(0.94 feet)' },
                     { date: 'Friday 20 July', time: '11:25 AM PDT', tideLevel: '(1.55 feet)' },
                     { date: 'Saturday 21 July', time: '12:24 PM PDT', tideLevel: '(2.06 feet)' },
                     { date: 'Sunday 22 July', time: ' 1:23 PM PDT', tideLevel: '(2.43 feet)' },
                     { date: 'Monday 23 July', time: ' 2:19 PM PDT', tideLevel: '(2.66 feet)' },
                     { date: 'Tuesday 24 July', time: ' 3:08 PM PDT', tideLevel: '(2.80 feet)' },
                     { date: 'Wednesday 25 July', time: ' 3:53 PM PDT', tideLevel: '(2.85 feet)' },
                     { date: 'Thursday 26 July', time: ' 4:34 PM PDT', tideLevel: '(2.86 feet)' },
                     { date: 'Friday 27 July', time: ' 5:12 PM PDT', tideLevel: '(2.84 feet)' },
                     { date: 'Saturday 28 July', time: ' 5:49 PM PDT', tideLevel: '(2.80 feet)' }
                  ]
               }
            );
            fetchMock.restore();
            done();
         }).catch(error => assert.fail(error));
      });
   });
});
