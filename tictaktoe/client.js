var express = require('express');
var Global = require('./global');
var Constants = require('./constants');
var app = express();
//app.set('views', './client/templates')
//app.set('view engine', 'jade')

app.use('/static', express.static(__dirname + '/client'));

app.get('/', function (req, res) {
  res.sendFile(Global.Path.join(__dirname + '/client/templates/index.html'));
});


var server = app.listen(Constants.httpPort, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});