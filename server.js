// server.js

// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var morgan         = require('morgan');
var mongoose       = require('mongoose');

var jwt            = require('jsonwebtoken');
var config         = require('./config/db.js');
var User           = require('./app/models/users.js');


// configuration ==========================================
// set our port
var port = process.env.PORT || 8080;
mongoose.connect(config.database);

// connect to our mongoDB database
// (uncomment after you enter in your own credentials in config/db.js)
// mongoose.connect(db.url);

// get all data/stuff of the body (POST) parameters
// parse application/json

app.use(morgan('dev'));
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

//call listen server after crawlering
var crawler = require('./app/scaraping.js');

prefix = 'http://www.imdb.com/movies-coming-soon/20';

var date = new Date();
var month = date.getMonth()+1;
var fixedMonth;
if( month < 10) {
  fixedMonth = "0"+String(month);
}
else {
  fixedMonth = String(month);
}

var year = date.getYear()-100;

// 현재 월로부터 총 3개의 페이지 크롤링
url = prefix + String(year) + "-" + fixedMonth + "/";
crawler().movieInfos(url, [],
  function(result) {


    month = (month + 1) % 12;
      if( month < 10) {
      fixedMonth = "0"+String(month);
    }
    else {
      fixedMonth = String(month);
    }

    url = prefix + String(year) + "-" + fixedMonth + "/";
    crawler().movieInfos(url, result, function(result) {

      month = (month + 1) % 12;
        if( month < 10) {
        fixedMonth = "0"+String(month);
      }
      else {
        fixedMonth = String(month);
      }
      url = prefix + String(year) + "-" + fixedMonth + "/";

      crawler().movieInfos(url, result, function(result) {
        require('./app/routes')(app, result); // configure our routes

        // start app ===============================================
        // startup our app at http://localhost:8080
        app.listen(port);

        // shoutout to the user
        console.log('Magic happens on port ' + port);
      });
    });
  });


// expose app
exports = module.exports = app;
