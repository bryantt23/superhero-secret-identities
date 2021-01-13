var createError = require('http-errors');
var express = require('express');
var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
require('dotenv').config();
// https://www.theodinproject.com/courses/nodejs/lessons/authentication-basics
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcryptjs');
// var usersRouter = require('./routes/users');
const User = require('./models/user');

//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qx7so.mongodb.net/secret_identities?retryWrites=true&w=majority`;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!' });
});

//TODO move to own file for user actions
app.get('/sign-up', (req, res) => res.render('sign-up'));

//TODO move to own file for user actions
async function generatePassword() {
  return await bcrypt.genSalt(10);
}

//TODO move to own file for user actions
app.post('/sign-up', async (req, res, next) => {
  // https://stackoverflow.com/questions/50791437/proper-usage-of-promise-await-and-async-function
  // generate a salt
  const salt = await generatePassword();

  // hash the password along with our new salt
  const txtPassword = await bcrypt.hash(req.body.password, salt);
  let newUser = new User({
    name: req.body.name,
    password: txtPassword
  });
  await newUser
    .save(err => {
      if (err) {
        console.log(err);
        return next(err);
      }
      console.log('New user has been added successfully ' + newUser);
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
      res.redirect('/');

      // handle error
    });
});

//TODO move to own file for user actions
app.post(
  '/log-in',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/'
  })
);

// app.get('/', (req, res) => res.render('index'));

/*
all routes
sign in
sign up
see all secrets
add secret

*/

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, () => console.log('app listening on port 3000!'));

module.exports = app;
