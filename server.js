var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var r = require('rethinkdbdash')();
var session = require('express-session');
var bodyParser = require("body-parser");
var bcrypt = require('bcrypt');

var formWriter = require('./formWriter');

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  name: 'ForumCreator',
  direct: true
});

app.set('view engine', 'jade');

var conn;
conn = r.connect(function(err,con){
  if(err){
    throw(err);
  }else{
    conn = con;
  }
});


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


io.on('connection', function(socket){
  console.log('a user connected');
});

app.use(session({
  secret: new Buffer([
    '65cc75794aeafcefe5635a5bc479d105e4595a04fa718ce31d09239f52e84827',
    '8534a12de8104811f8c107a79a4939b6a790059abd74313072626f8134c88901'
].join(''), 'hex').toString(),
  resave: false,
  saveUninitialized: false
}));

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/login', function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});

app.get('/login', function(req,res){
  if(req.query.uname && req.query.verify){
    r.db('FormCreator').table('account').get(req.query.uname).run(conn, function(err,result){
      if(err) throw(err);
      console.log(result);
      if(result === null){
        res.redirect('/signup?error=Account+doesnt+exist');
      }else{
        if(result.verify != ""){
          if(result.verify == req.query.verify){ // GET /login?verify=Verification Code
            res.redirect('/login?error=Account+activated+please+sign+in');
            r.db('FormCreator').table('account').get(req.query.uname.toLowerCase()).update({verify:""});
          }
        }else{
          res.redirect('/login');
        }
      }
    }.bind(this));
  }else{
    var sess = req.session;
    checkuser(req);
    if(sess.user.signedin){
      res.redirect('/');
    }else{
      res.render('login', {error: req.param('error')});
    }
  }
});

app.post('/login', function (req, res) {
  r.db('FormCreator').table('account').get(req.body.username.toLowerCase()).run(conn, function(err,result){
    if(err) throw(err);
    console.log(result);
    if(result === null){
      res.redirect('/signup?error=Account+doesnt+exist');
    }else{
      if(result.verify != ""){
        if(result.verify == req.body.password){
          r.db('FormCreator').table('account').get(req.body.username.toLowerCase()).update({verify:""}).run(function(err){
            if (err) throw err;
          });
          res.redirect('/login?error=Account+activated+please+sign+in');
        }else{
          res.redirect('/login?error=Account+not+activated+Please+check+your+email');
        }
      }else{
        bcrypt.compare(req.body.password, result.password, function(err, result) {
          if(err) throw(err);
          if(result){
            var sess = req.session;
            sess.user = {signedin:true,username:req.body.username};
            res.redirect('/');
          }else{
            res.redirect('/login?error=Incorrect+password');
          }
        });
      }
    }
  }.bind(this));
  
});
var re = new RegExp("^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$");
var usrCheck = function(user){
  return(user.match(re) && user.length >= 3 && user.length <= 20);
};

app.post('/signup', function (req, res) {
  console.log(req.body.username.toLowerCase());
  r.db('FormCreator').table('account').filter({id: req.body.username.toLowerCase()}).count().run(conn,function(err, result){
    if(err){
      throw(err);
    }else{
      console.log(result);
      if(result <= 0){
        if(req.body.password == req.body.confirm){
          var passwordhash;
          if(usrCheck(req.body.username)){
            bcrypt.hash(req.body.password, 11, function(err, hash){
              if(err) throw(err);
              passwordhash = hash;
              var verification = "nsdg3qer";
              r.db('FormCreator').table('account').insert({
                id: req.body.username.toLowerCase(),
                username: req.body.username,
                password: passwordhash,
                email: req.body.email,
                verify: verification
              }).run(conn,function(err,result){if (err) throw (err);});
              /*var mail = {
                name: "ForumCreator.ml",
                address: "account@forumcreator.ml",
                to: req.body.email,
                from: "account@forumcreator.ml",
                subject: "✔ ForumCreator Account Verification ✔",
                html: "DO NOT TRUST EMAILS FROM THIS ADDRESS. You (or someone pretending to be you) is trying to create a forumcreator.ml account with the username " + req.body.username + ". If this is you, go to <a href='http://forumcreator.ml/login?uname=" + req.body.username + "&verify=" + verification +  "'>this link</a> to verify your account. If this doesn\'t work, sign in to your account with the password \"" + verification + "\". After that, you can use the password entered. If this wasn't you, you can safely ignore this email.",
                text: "DO NOT TRUST EMAILS FROM THIS ADDRESS. You (or someone pretending to be you) is trying to create a forumcreator.ml account with the username " + req.body.username + ". If this is you, go to http://forumcreator.ml/login?uname=" + req.body.username + "&verify=" + verification +  " to verify your account. If this doesn\'t work, sign in to your account with the password \"" + verification + "\". After that, you can use the password entered. If this wasn't you, you can safely ignore this email."
              };
              transporter.sendMail(mail, function(error, info){
                if(error){
                    return console.log(error);
                }
                console.log('Message sent: ' + info.response);
              });*/
              console.log(' Account Created: ' + req.body.username.toLowerCase() + ' with verification code ' + verification);
            }.bind(this));
            
            res.redirect('/login?error=Verification+email+sent');
          }else{
            res.redirect('/signup?error=Invalid+username');
          }
        }else{
          res.redirect('/signup?error=Password+and+confirmation+password+must+match');
        }
      }else{
        res.redirect('/signup?error=User+already+exists');
      }
    }
  }.bind(this));
});

app.get('/logout', function (req, res) {
  var sess = req.session;
  sess.user = {signedin:false};
  res.redirect('/');
});

app.get('/settings', function (req, res) {
  var sess = req.session;
  checkuser(req);
  if(sess.user.signedin){
    res.render('userinfo', { username: sess.user.username  });
  }else{
    res.redirect('/');
  }
});

app.get('/newform', function (req, res) {
  var sess = req.session;
  checkuser(req);
  if(sess.user.signedin){
    res.render('editor', { username: sess.user.username  });
  }else{
    res.redirect('/');
  }
});

app.get('/forms', function (req, res) {
  var sess = req.session;
  checkuser(req);
  if(sess.user.signedin){
    res.render('files', { username: sess.user.username  });
  }else{
    res.redirect('/login');
  }
});

// accept PUT request at /user
app.put('/user', function (req, res) {
  res.send('Got a PUT request at /user');
});

app.get('/signup', function(req,res){
  var sess = req.session;
  checkuser(req);
  if(sess.user.signedin){
    res.redirect('/');
  }else{
    res.render('signup', {error: req.param('error')});
  }
});

var checkuser = function(req){
  var sess = req.session;
  if(sess.user === undefined){sess.user = {signedin: false};}
};

app.get('/', function(req,res){
  var sess = req.session;
  checkuser(req);
  if(sess.user.signedin){
    res.redirect('/forms');
  }else{
    res.redirect('/login');
  }
  /*var sess = req.session;
  console.log(sess.user);
  if(sess.user === undefined){
    sess.user = {signedin:false};
  }
  if(sess.user.signedin){
    switch(sess.url){
      case "LIST":
        console.log('files');
        res.render('files', { username: sess.user.username  });break;
      case "LOADFILE":
        console.log('editor');
        res.render('editor', { username: sess.user.username  });break;
      default:
        console.log('500');
        res.render('500',{error: 'URL not found: ' + sess.url + '. Refresh page to fix'});
        sess.url = "LIST";break;
    }
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
        res.render('500',{error: 'URL not found: ' + sess.url + '. Refresh page to fix'});
        sess.url = "LOGIN";break;
    }
  }*/
  //res.render('signup');
  //res.render('editor');
});
app.get('*', function(req,res){
  res.render('404');
});

http.listen(process.env.PORT, function(){
  console.log('listening on *:' + process.env.PORT);
});