var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var passport = require('passport');

let User = require('../models/user');

/* GET users listing. */
router.get('/register', function(req, res, next) {
	res.render('register');
  /*res.send('respond with a resource');*/
});

router.post('/register', function(req, res){
	const name = req.body.name;
	const email = req.body.email;
	const username = req.body.username;
	const password = req.body.password;
	const password2 = req.body.password2;

	req.check('name', 'Name is required').notEmpty();
	req.check('email', 'Email is required').notEmpty();
	req.check('email', 'Email is not valid').isEmail();
	req.check('username', 'Username is required').notEmpty();
	req.check('password', 'Password is required').notEmpty();
	req.check('password2', 'Passwords not match').equals(req.body.password);

	let errors = req.validationErrors();

	if(errors){
		res.render('register', {
			errors:errors
		});		
	} else {
		let newUser = new User({
			name:name,
			email:email,
			username:username,
			password:password
		});

	bcrypt.genSalt(10, function(err, salt){
		bcrypt.hash(newUser.password, salt, function(err, hash){
			if(err){
				console.log(err);
			}
			newUser.password = hash;
			newUser.save(function(err){
				if(err) {
					console.log(err);
					return;
				} else {
					res.redirect('/users/login');
				}
			});
		});
	});
	};

});

router.get('/login', function(req, res){
	res.render('login');
});

router.post('/login', function(req, res, next){
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/users/register',
	})(req, res, next);
});

module.exports = router;
