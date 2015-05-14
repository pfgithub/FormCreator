var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var r = require('rethinkdbdash')();

/*
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/js.js', function(req, res){
  res.sendFile(__dirname + '/js.js');
});
app.get('/css.css', function(req, res){
  res.sendFile(__dirname + '/css.css');
});
*/

app.use(express.static('www')); 


http.listen(process.env.PORT, function(){
  console.log('listening on *:3000');
});