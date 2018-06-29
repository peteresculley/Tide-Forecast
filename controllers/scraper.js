const fetch = require('node-fetch');
const JSSoup = require('jssoup').default;

function initScraper(location, url) {
   return fetch(url)
      .then(res => res.text())
      .then(body => {
         let result = {
            location: location,
            data: []
         };

         // extract only the table section manually because JSSoup cannot handle the full document
         let startIndex = body.indexOf('<table');
         let endIndex = body.lastIndexOf('</table>') + 8;
         let tableBody = body.substring(startIndex, endIndex);

         let soup = new JSSoup(tableBody);
         let allTableRows = soup.findAll('tr');

         let isSunUp = false;
         let currentDate = "";
         for(let row of allTableRows) {
            let allColumns = row.findAll('td');
            if(row.find('td', 'date')) { // JSSoup does not allow accessing attributes after findAll
               currentDate = allColumns[0].text;
            }

            let sunState = allColumns[allColumns.length-1].text;
            switch(sunState) {
               case "Sunrise":
                  isSunUp = true;
                  break;
               case "Low Tide":
                  if(isSunUp) {
                     // time field is made of a time and timezone
                     result.data.push({
                        date: currentDate,
                        time: allColumns[0].text + " " + allColumns[1].text,
                        tideLevel: allColumns[3].text
                     });
                  }
                  break;
               case "Sunset":
                  isSunUp = false;
                  break;
            }
         }
         return result;
   });
}

module.exports = {
   initScraper
};
