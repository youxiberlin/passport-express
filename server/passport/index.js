const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
const axios = require('axios');

const local = new LocalStrategy(
	{ usernameField: 'email' },
	(email, password, done) => {
		axios.get(`http://localhost:5001/users?email=${email}`)
		.then(res => {
			const user = res.data[0]
			if (!user) {
				return done(null, false, { message: 'Invalid credential. \n'});
			}
			if (!bcrypt.compareSync(password, user.password)) {
				return done(null, false, { message: 'Invalid credentials.\n' });
			}
			return done(null, user)
		})
		.catch(error => done(error));
	}
);

module.exports = function (passport){
	passport.serializeUser((user, done) => {
		console.log('Inside serializeUser callback. User id is save to the session file store here')
		done(null, user.id);
	});
	
	passport.deserializeUser((id, done) => {
		console.log('deserialize user')
		axios.get(`http://localhost:5001/users/${id}`)
			.then(res => done(null, res.data))
			.catch(error => done(error, false))
	});

	passport.use(local);
};