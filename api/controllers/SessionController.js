/**
 * SessionController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    
  new: function(req, res) { 
  	res.view('session/new');
  },

  create: function(req, res, next) {
  	if(!req.param('email') || !req.param('password')) {
  		var usernamePasswordRequiredError = [{name: 'usernamePasswordRequiredError', message: 'You must enter both a username and pssword.'}];
  		req.session.flash = {
  			err: usernamePasswordRequiredError
  		}
  		res.redirect('/session/new')
  		return;
  	}

  	User.findOneByEmail(req.param('email')).done(function(err, user) {
  		if(err) return next(err);

  		if (!user) {
  			var noAccountError = [{name: 'noAccountError', message: 'The email address you have entered is not associated with any account.'}];
	  		req.session.flash = {
	  			err: noAccountError
	  		}
	  		res.redirect('/session/new')
	  		return;
  		}

  		require('bcrypt').compare(req.param('password'), user.encryptedPassword, function(err, valid) {
	      if (err) return next(err);
	      if(!valid) {
	      	var incorrectPasswordError = [{name: 'incorrectPasswordError', message: 'This username password combination is incorrect.'}];
	  		req.session.flash = {
	  			err: incorrectPasswordError
	  		}
	  		res.redirect('/session/new')
	  		return;
	      }

	      req.session.isAuthenticated = true;
	      req.session.User = user;

        if(req.session.User.admin) {
          res.redirect("/user")
          return
        }

	      res.redirect('/user/show/' + user.id)
	    });


  	});

  },

  destroy: function(req, res) {
  	req.session.destroy();
  	res.redirect('/session/new');
  },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SessionController)
   */
  _config: {}

  
};
