/**
 * profileAuth
 *
 * @module      :: Policy
 * @description :: The policy allows only admins to view, edit and update prfiles
 *
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

  var sessionUserMatchesId = req.session.User.id === req.param('id');
  var isAdmin = req.session.User.admin

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  if (!(sessionUserMatchesId||isAdmin)) {
    var nonRightError = [{name: 'noRights', message: 'You must be an admin'}];
    req.session.flash = {
      err: nonRightError
    }
    res.redirect(req.header('Referer'));
    return;
  }

  next();

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  //return res.forbidden('You are not permitted to perform this action.');
};