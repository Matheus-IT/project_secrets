//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const saltRounds = 10;


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
	bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
		const newUser = new User({
			email: req.body.username,
			password: hash,
		});
		newUser.save().then(() => {
			res.render('secrets');
		}).catch(error => console.log(error));
	});
});

app.post('/login', function(req, res) {
	const { username, password } = req.body;

	User.findOne({ email: username }).exec().then((user) => {
		bcrypt.compare(password, user.password, function(err, result) {
			if (result) {
				res.render('secrets');
			} else {
				res.send('password din\'t match!');
			}
		});
	});
});
