var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var r = require('rethinkdbdash')();

app.use(express.static('www')); 


http.listen(process.env.PORT, function(){
  console.log('listening on *:3000');
});