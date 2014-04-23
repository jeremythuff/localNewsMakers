/**
 * isAdmin
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any admin user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  if (req.session.User.admin && req.session.User) {
    return next();
  } else {
  	var requireAdminError = [{name: 'requireAdminError', message: 'You must be an administrator.'}];
	req.session.flash = {
		err: requireLoginError
	}
	res.redirect(req.header('Referer'));
	return;
  }
};
