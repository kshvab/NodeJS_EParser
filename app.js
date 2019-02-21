//  --- SERVICES ---
const services = require('./services');
var fs = require('fs');

//services.catsCreating.runCategoriesParsing();
services.itemsCreating.runItemsParsing();

/*
var itemsArrJson = fs.readFileSync('./shopItemsArrFile.json', {
  encoding: 'UTF-8'
});

let itemsArr = JSON.parse(itemsArrJson);

console.log(itemsArr.length);

*/
