var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

var port = 8080;
app.get('/', function(req, res) {
  // The URL we will scrape from - in our example Anchorman 2.

  'use strict';
  var url = 'http://en.wikiquote.org/wiki/Latin_proverbs';

  // The structure of our request call
  // The first parameter is our URL
  // The callback function takes 3 parameters, an error, response status code and the html

  request(url, function(error, response, html) {

    if (error) {
      console.log(error);
    }

    // First we'll check to make sure no errors occurred when making the request

    if (!error) {
      // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
      var $ = cheerio.load(html);

      var proverbArray = [];

      var all = $('#mw-content-text').children('ul');

      // console.log(all);

      all.each(function () {
        var el = $(this);

        var li = el.find(' > li');

        var origin = el.find(' > i').eq(0).text();

        // var translation = li.find(' > ul li').eq(0).text().replace('Translation: ','');
        // var equivalent = li.find(' > ul li').eq(1).text().replace('English equivalent: ','');
        // var meaning = li.find(' > ul li').eq(2).text().replace('Meaning: ','');


        // console.log(origin);
        var json = {};
        json.origin = origin;
        // json.translation = translation;
        // json.equivalent = equivalent;
        // json.meaning = meaning;


        var rows = li.find(' > ul li');

        rows.each(function () {
          var one = $(this).text();
          if (one.match(/Translation:/)) {
            json.translation = one.replace('Translation: ','');
          }

          if (one.match(/English equivalent:/)) {
            json.equivalent = one.replace('English equivalent: ','');
          }

          if (one.match(/Meaning:/)) {
            json.meaning = one.replace('Meaning: ','');
          }
        });

        proverbArray.push(json);
      });

      // forEach(all, function (el) {
      //   console.log(el);
      // });

      // $('#mw-content-text').filter(function() {
      //   var data = $(this);
      //   var main = data.find('ul > li > i').text();
      //   console.log(data);
      //   json.proverb = main;
      // });

      json = JSON.stringify(proverbArray, null, 4);

      // var json2csv = require('json2csv');

      // json2csv({data: json}, function(err, csv) {
      //   if (err) console.log(err);
      //   // console.log(csv);
      //   fs.writeFile('output.cvs', csv, function(err) {
      //     console.log('File successfully written! - Check your project directory for the output.cvs file');
      //   });
      // });


      fs.writeFile('output.json', json, function(err) {

        console.log('File successfully written! - Check your project directory for the output.json file');

      });

      // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
      res.send('Check your console!');
    }
  });
});

app.listen(port);
console.log('Listening on port ' + port);
exports = module.exports = app;
