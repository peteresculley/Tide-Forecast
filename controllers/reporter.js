function startReport() {
   console.log("Daylight low tides within the next 7 days:\n");
}

function reportTideResults(results) {
   let convertedLocation = makeLocationReadable(results.location);
   console.log(convertedLocation);
   for(let result of results.data) {
      let output = result.date.padEnd(20)
                 + result.time.padEnd(16)
                 + result.tideLevel;
      console.log(output);
   }
   console.log();
}

function makeLocationReadable(location) {
   return location.replace(/-/g, " ");
}

module.exports = {
   startReport,
   reportTideResults
};
