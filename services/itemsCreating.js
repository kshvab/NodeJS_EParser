var request = require('request');
var fs = require('fs');
const cheerio = require('cheerio');
var slugify = require('slugify');

function runItemsParsing() {
  var catArrJson = fs.readFileSync('./shopCategoriesArrFile.txt', {
    encoding: 'UTF-8'
  });

  let catArr = JSON.parse(catArrJson);

  var itemsArr = [];
  var catArrLen = catArr.length;
  // var catArrLen = 8;
  var counter = 0;
  nextCat(counter);

  function nextCat(n) {
    catItemsParsing(catArr[n].catUrl, catArr[n].catId).then(
      iCatItemsArr => {
        console.log('Parsing Cat #:' + n);
        if (iCatItemsArr) {
          for (var i = 0; i < iCatItemsArr.length; i++) {
            itemsArr.push(iCatItemsArr[i]);
          }
        }
        counter++;
        if (counter < catArrLen) nextCat(counter);
        if (counter == catArrLen) {
          console.log('Parsing is complet');
          saveItemsArr(itemsArr);
        }
      },
      error => console.log(error)
    );
  }
}

function saveItemsArr(itemsArr) {
  //console.dir(itemsArr);

  let shopItemsArrStr = JSON.stringify(itemsArr);

  fs.writeFile('./shopItemsArrFile.txt', shopItemsArrStr, function(err) {
    if (err) console.log('ERROR Saving!');
    console.log('Saved Items!');
  });
}

function catItemsParsing(catUrl, catId) {
  return new Promise(function(resolve, reject) {
    catUrl += '/?limit=500';

    request(catUrl, function(error, response, body) {
      if (error) {
        console.log(error);
        reject(error);
      }

      var $ = cheerio.load(body, { decodeEntities: false });

      let catItemsLen = $('.product-list .name-product a').length;

      if (!catItemsLen) resolve(0);
      let catItemsArr = [];

      for (let i = 0; i < catItemsLen; i++) {
        let item = {};
        let murovdagUrl = $('.product-list .name-product a')
          .eq(i)
          .attr('href');
        let name = $('.product-list .name-product a')
          .eq(i)
          .text();

        let vendorCode = $('.product-list .models')
          .eq(i)
          .text();
        vendorCode = vendorCode.slice(10);
        let notSingleItem = false;
        let manufacturer = '';
        let notAvailableForSale = false;
        let price = $('.product-list .price-product')
          .eq(i)
          .text();
        //
        price = fPriceNorm(price);
        function fPriceNorm(price) {
          let priceln = price.length;
          let pos = price.indexOf('$');
          return parseFloat(price.slice(-(priceln - pos - 1)));
        }

        let stock = 10;
        let baseUnit = 'шт';
        let picture = $('.product-list img')
          .eq(i)
          .attr('src');
        let id = vendorCode;

        let groups = catId;

        var itemsInCatLen = $('.product-list').length;

        item = {
          murovdagUrl,
          name,
          vendorCode,
          notSingleItem,
          manufacturer,
          notAvailableForSale,
          price,
          stock,
          baseUnit,
          picture,
          id,
          groups
        };
        catItemsArr.push(item);
      }

      resolve(catItemsArr);
    });
  });
}

module.exports = {
  runItemsParsing
};
