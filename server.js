var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var r = require('rethinkdbdash')();
var session = require('express-session');
var bodyParser = require("body-parser");

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
    '65cc75794aeafcefe5635a5bc479d105e4595a04fa718ce31d09239f52e84827',
    '8534a12de8104811f8c107a79a4939b6a790059abd74313072626f8134c88901'
].join(''), 'hex').toString(),
  resave: false,
  saveUninitialized: false
}));

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/login', function (req, res) {
  var sess = req.session;
  sess.user = {signedin:true,username:req.username};
  console.log(sess.user);
  console.log(req.body.username);
  res.redirect('/');
});

app.post('/logout', function (req, res) {
  var sess = req.session;
  sess.user = {signedin:false};
  res.redirect('/');
});

// accept PUT request at /user
app.put('/user', function (req, res) {
  res.send('Got a PUT request at /user');
});

app.get('/signup', function(req,res){
  var sess = req.session;
  sess.url = "SIGNUP";
  res.redirect('/');
});

app.get('/login', function(req,res){
  var sess = req.session;
  sess.url = "LOGIN";
  res.redirect('/');
});

app.get('/', function(req,res){
  var sess = req.session;
  console.log(sess.user);
  if(sess.user === undefined){
    sess.user = {signedin:false};
  }
  if(sess.user.signedin){
    console.log('editor');
    res.render('editor');
  }else{
    if(sess.url === undefined){sess.url = "LOGIN";}
    switch(sess.url){
      case "LOGIN":
        console.log('login');
        res.render('login');break;
      case "SIGNUP":
        console.log('signup');
        res.render('signup');break;
      default:
        console.log('500');
        res.render('500');break;
    }
  }
  //res.render('signup');
  //res.render('editor');
});
app.get('*', function(req,res){
  res.render('404');
});

http.listen(process.env.PORT, function(){
  console.log('listening on *:3000');
});