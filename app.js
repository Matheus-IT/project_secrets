//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const LocalStrategy = require('passport-local').Strategy;


const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
	extended: true,
}));

app.use(session({
	secret: 'OurLittleSecret.',
	resave: false,
	saveUninitialized: false,
}));

const database = 'userDB';
mongoose.connect(`mongodb://localhost:27017/${database}`);

const db = mongoose.connection;

const userSchema = new mongoose.Schema({
	email: String,
	password: String,
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

const strategy = new LocalStrategy(User.authenticate());
passport.use(strategy);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());


app.listen(3000, function() {
	console.log('Server started on port 3000');
});

app.get('/', function(req, res) {
	res.render('home');
});

app.get('/login', function(req, res) {
	res.render('login');
});

app.get('/register', function(req, res) {
	res.render('register');
});

app.get('/secrets', function(req, res) {
	if (req.isAuthenticated()) {
		console.log('authenticate');
		res.render('secrets');
	} else {
		res.render('login');
		console.log('not authenticate');
	}
});

app.post('/register', function(req, res, next) {
	const { username, password } = req.body;

	User.register({username: username}, password, (error, user) => {
		if (error) {
			console.log('something went wrong at register:', error);
			res.redirect('/register');
		} else {
			passport.authenticate('local', (error, user, info, status) => {
				res.redirect('/secrets');
			})(req, res, next);
		}
	});
});

app.post('/login', function(req, res) {
	console.log('/login');
	const { username, password } = req.body;
});
