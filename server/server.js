const express = require('express');
const uuidv4 = require('uuid').v4;
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const passport = require('passport');
require('./passport')(passport);
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(session({
	genid: (req) => {
		console.log('Inside the session middleware');
		console.log(req.sessionID);
		return uuidv4();
	},
	store: new FileStore(),
	secret: 'keyboad cat',
	resave: false,
	saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
	console.log('inside homepage cb');
	console.log(req.sessionID);
	res.send('you hit the homepage　\n');
});

app.get('/login', (req, res) => {
	console.log('inside GET /login cb');
	console.log(req.sessionID);
	res.send('you got the login page \n');
});

app.post('/login', (req, res, next) => {
	console.log('Inside POST /login callback')
	passport.authenticate('local', (err, user, info) => {
		console.log('Inside passport.authenticate() callback');
		console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
		console.log(`req.user: ${JSON.stringify(req.user)}`)
		req.login(user, (err) => {
		console.log('Inside req.login() callback')
		console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
		console.log(`req.user: ${JSON.stringify(req.user)}`)
		return res.send('You were authenticated & logged in!\n');
	  })
	})(req, res, next);
})

app.get('/authrequired', (req, res) => {
	console.log('Inside GET /authrequired callback')
	console.log(`User authenticated? ${req.isAuthenticated()}`)
	if(req.isAuthenticated()) {
		res.send('you hit the authentication endpoint\n')
	} else {
		res.redirect('/')
	}
})


app.listen(3000, () => console.log('listening on localhost:3000'))