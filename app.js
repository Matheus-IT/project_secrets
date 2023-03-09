//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const md5 = require('md5');
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
	extended: true,
}));

const database = 'userDB';
mongoose.connect(`mongodb://localhost:27017/${database}`);


const userSchema = new mongoose.Schema({
	email: String,
	password: String,
});

const User = mongoose.model('User', userSchema);


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

app.post('/register', function(req, res) {
	const newUser = new User({
		email: req.body.username,
		password: md5(req.body.password),
	});
	newUser.save().then(() => {
		res.render('secrets');
	}).catch(error => console.log(error));
});

app.post('/login', function(req, res) {
	const { username, password } = req.body;

	const hashedPassword = md5(password);

	User.findOne({ email: username }).exec().then((user) => {
		if (user.password === hashedPassword) {
			res.render('secrets');
		} else {
			res.send('password din\'t match!');
		}
	});
});
