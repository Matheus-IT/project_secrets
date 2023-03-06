//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
	extended: true,
}));

const database = 'userDB';
mongoose.connect(`mongodb://localhost:27017/${database}`);


const userSchema = {
	email: String,
	password: String,
};
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
		password: req.body.password,
	});
	newUser.save().then(() => {
		res.render('secrets');
	}).catch(error => console.log(error));
});

app.post('/login', function(req, res) {
	const { username, password } = req.body;

	User.findOne({ email: username }).exec().then((user) => {
		if (user.password === password) {
			res.render('secrets');
		} else {
			console.log('password din\'t match!');
		}
	});
});
