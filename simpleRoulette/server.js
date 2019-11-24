var express  = require('express');
var app      = express();
var bodyParser   = require('body-parser');
const MongoClient = require('mongodb').MongoClient
var passport = require('passport');
var flash    = require('connect-flash');
const mongoose = require('mongoose')
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var url = "mongodb+srv://demo:demo@roulett-8r9tn.mongodb.net/test?retryWrites=true&w=majority"
require('./config/passport')(passport);
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.set('view engine', 'ejs');
app.use(session({
    secret: 'rcbootcamp2019a', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());
app.listen(3000, () => {
  mongoose.connect(url, { useUnifiedTopology: true }, (err, database) => {
    if (err) return console.log(err)
    db = database
  });
    // MongoClient.connect(url, { useNewUrlParser: true }, (error, client) => {
    //     if(error) {
    //         throw error;
    //     }
    //     db = client.db("test");
    //     console.log("Connected to `" + "test" + "`!");
    // });
});
app.get('/', function(req, res) {
    res.render('index.html');
});
app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : 'error.html', //
    failureFlash : true // allow flash messages
}));
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
app.get('/profile', isLoggedIn, function(req, res) {
    db.collection('users').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('profile.ejs', {
        user : req.user,
        data: result
      })
    })
});
app.put('/game', (req, res) => {
  console.log("gi")
  if ("winning" in req.body){
    db.collection('users')
    .findOneAndUpdate({test: 2}, {
      $inc: {
        "local.win" : 1,
        "local.winnings": req.body.bet
      }
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
  }else if ("losing" in req.body) {
    console.log("hi")
    db.collection('users')
    .findOneAndUpdate({test:2}, {
      // inc-- increments score
      $inc: {
        "local.lost" : 1,//number of times people lost
        "local.losses": req.body.bet
      }
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
  }
})
console.log('The magic happens on port ' + 3000);
