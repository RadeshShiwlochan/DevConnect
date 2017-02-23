'use strict';

//CANON_URL is the URL that accesses our site in the browser. 
//Update this constant's value whenever a change in server address occurs, such as at deployment.
var CANON_URL = 'https://localhost:3000';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var methodOverride = require('method-override');
var session = require('express-session');
var flash = require('express-flash');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
//var dotenv = require('dotenv');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var passport = require('passport');
var permission = require('permission');
var uuidV4 = require('uuid/v4');

// Connect to mongolab
var mongodb = require('mongodb');
var uri = 'mongodb://heroku_4bx1jh73:ik3humdq4ktskmjhdugum7bkv8@ds161169.mlab.com:61169/heroku_4bx1jh73';
mongodb.MongoClient.connect(uri, function (err, db) {
    /* adventure! */
});

// COMMENTED THIS OUT BECAUSE OF HEROKU ERROR
// 
// Load environment variables from .env file
//dotenv.load();

// Controllers
var HomeController      = require('./controllers/home');
var userController      = require('./controllers/user');
var contactController   = require('./controllers/contact');
var aboutController     = require('./controllers/about');
var resourcesController  = require('./controllers/resources');
var forumController     = require('./controllers/forum');

// Passport OAuth strategies
require('./config/passport');

var app = express();

// COMMENTED THIS OUT BECAUSE OF HEROKU ERROR
//
// mongoose.connect(process.env.MONGODB);
// mongoose.connection.on('error', function() {
//   console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
//   process.exit(1);
// });

var hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: {
    ifeq: function(a, b, options) {
      if (a === b) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    toJSON : function(object) {
      return JSON.stringify(object);
    },
    math : function(lvalue, operator, rvalue, options) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
            
        return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue
        }[operator];
    }
  }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(methodOverride('_method'));
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', HomeController.index);
app.get('/about', aboutController.index);
app.post('/about', contactController.contactPost);
app.get('/resources', resourcesController.index);
app.get('/forum', forumController.index);
app.get('/account', userController.ensureAuthenticated, userController.accountGet);
app.put('/account', userController.ensureAuthenticated, userController.accountPut);
app.delete('/account', userController.ensureAuthenticated, userController.accountDelete);
app.get('/signup', userController.signupGet);
app.post('/signup', userController.signupPost);
app.get('/login', userController.loginGet);
app.post('/login', userController.loginPost);
app.get('/forgot', userController.forgotGet);
app.post('/forgot', userController.forgotPost);
app.get('/reset/:token', userController.resetGet);
app.post('/reset/:token', userController.resetPost);
app.get('/logout', userController.logout);
app.get('/unlink/:provider', userController.ensureAuthenticated, userController.unlink);
app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }));
app.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email profile repo' ] }));
app.get('/auth/github/callback', passport.authenticate('github', { successRedirect: '/', failureRedirect: '/login' }));
app.post('/forum/delete/:postid', require('permission')(['admin']), forumController.deletePost);

//code for the forum page
app.get('/forum', forumController.index);
app.get('/forum/:uuid', forumController.viewPost);
app.post('/forum', forumController.createPost);
app.post('/forum/:uuid/upvote', forumController.upvotePost);
app.post('/forum/:uuid/downvote', forumController.downvotePost);

// Production error handler
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(err.status || 500);
  });
}

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
