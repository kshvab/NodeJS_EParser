var request = require('request');
var fs = require('fs');
const cheerio = require('cheerio');
var slugify = require('slugify');

function runItemsParsing() {
  var apiUrl =
    'http://murovdag.com.ua/veloaksessuary/bardachki-sumki-ryukzaki-perchatki-dlya-velosipeda/?limit=500';

  request(apiUrl, function(error, response, body) {
    if (error) {
      console.log(error);
      return;
    }

    var $ = cheerio.load(body, { decodeEntities: false });

    let murovdagUrl = $('.product-list .name-product a')
      .eq(3)
      .attr('href');
    let name = $('.product-list .name-product a')
      .eq(3)
      .text();

    let vendorCode = $('.product-list .models')
      .eq(3)
      .text();
    let notSingleItem = false;
    let manufacturer = '';
    let notAvailableForSale = false;
    let price = $('.product-list .price-product')
      .eq(3)
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
      .eq(3)
      .attr('src');
    let id = fIdNorm(murovdagUrl);

    function fIdNorm(url) {
      let urlln = url.length;
      let pos = url.indexOf('id=');
      return url.slice(-(urlln - pos - 3));
    }

    let groups = '';
    console.log(id);

    var itemsInCatLen = $('.product-list').length;
    var itemsArr = [];
    itemsArr.push({
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
    });

    console.log(itemsArr);
  });
}

module.exports = {
  runItemsParsing
};

/*
var content = fs.readFileSync('./resource/sitemap.html', {
encoding: 'UTF-8'
});
*/
