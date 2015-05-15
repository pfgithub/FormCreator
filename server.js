var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var r = require('rethinkdbdash')();
var session = require('express-session');

app.set('view engine', 'jade');

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

app.use(session({
  secret: new Buffer([
    "65cc75794aeafcefe5635a5bc479d105e4595a04fa718ce31d09239f52e84827",
    "8534a12de8104811f8c107a79a4939b6a790059abd74313072626f8134c88901"
].join(''), 'hex').toString(),
  resave: true
}));

app.get('/', function(req,res){
  res.render('login');
  res.render('signup');
  res.render('editor');
});

app.get('*', function(req,res){
  res.render('404');
});

http.listen(process.env.PORT, function(){
  console.log('listening on *:3000');
});