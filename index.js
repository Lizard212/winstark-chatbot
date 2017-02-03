var logger = require('morgan');
var http = require('http');
var request = require('request');
var bodyParser = require('body-parser');
var express = require('express');
var router = express();


var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

var server = http.createServer(app);

app.get('/', (req, res)=> {
  res.send("Hello. This is index page !You're welcome here !")
});

app.get('/webhook', function(req, res) {
  if(req.query['hub.verify_token'] === 'winter_is_coming'){
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

app.set('port', (process.env.PORT || 5000));

server.listen(app.get('port'), function() {
  console.log('Chat bot server listening at ', app.get('port'));
});



