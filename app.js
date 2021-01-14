/////// app.js
const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const mongoDb =
  'mongodb+srv://bry123:bry123@cluster0.qx7so.mongodb.net/secret_identities?retryWrites=true&w=majority';
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

const User = require('./models/user');
// const Secret = require('./models/secret');
// const Post = require('./models/post');

//TODO use my model file
// const User = mongoose.model(
//   'User',
//   new Schema({
//     username: {
//       type: String,
//       required: true
//     },
//     password: { type: String, required: true },
//     isAdmin: { type: Boolean, default: false },
//     isMember: { type: Boolean, default: false }
//   })
// );

const app = express();
app.set('views', __dirname);
app.set('view engine', 'pug');

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { msg: 'Incorrect username' });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          return done(null, user);
        } else {
          // passwords do not match!
          return done(null, false, { msg: 'Incorrect password' });
        }
      });
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.get('/', async (req, res) => {
  let data;
  await User.find({}, function (err, result) {
    if (err) throw err;
    data = result;
    console.log('result: ' + JSON.stringify(result));
    // db.close();
  });
  // https://stackoverflow.com/questions/34796878/how-to-pass-data-between-routes-in-express
  // app.set('data', req.user);
  res.render('index', { user: req.user, data });
});

//TODO move views into view folder
app.get('/log-out', (req, res) => {
  //TODO clear app.set data
  req.logout();
  res.redirect('/');
});

app.listen(3000, () => console.log('app listening on port 3000!'));

app.get('/sign-up', (req, res) => res.render('sign-up'));

async function generatePassword() {
  return await bcrypt.genSalt(10);
}
// https://stackoverflow.com/questions/41149686/update-boolean-with-mongoose
app.get('/change-is-admin/:id', async (req, res, next) => {
  var user_id = req.params.id;
  console.log(user_id);
  await User.findById(user_id, function (err, user) {
    user.isAdmin = !user.isAdmin;
    user.save(function (err) {
      if (err) console.log(err);
    });
  });

  //   console.log(user);
  //   let { isAdmin } = user;
  //   isAdmin = !isAdmin;
  //   user.update(
  //     { _id: user_id },
  //     {
  //       isAdmin: isAdmin
  //     }
  //   );
  res.redirect('/');
});

app.post('/sign-up', async (req, res, next) => {
  // https://stackoverflow.com/questions/50791437/proper-usage-of-promise-await-and-async-function
  // generate a salt
  const salt = await generatePassword();

  // hash the password along with our new salt
  const txtPassword = await bcrypt.hash(req.body.password, salt);
  let newUser = new User({
    username: req.body.username,
    password: txtPassword
  });
  await newUser
    .save(err => {
      if (err) {
        return next(err);
      }
      console.log('New user has been added successfully with Id');
      res.redirect('/');
    })
    .catch(err => {
      // handle error
    });
});

app.post(
  '/log-in',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/'
  })
);
