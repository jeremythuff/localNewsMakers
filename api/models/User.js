/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  schema: true,

  attributes: {
  	
  	email: {
      type: 'STRING',
      email: true ,
      unique: true,
      required: true
    },
    encryptedPassword: {
      type: 'STRING'
    },
    admin: {
      type: 'BOOLEAN',
      defaultsTo: false
    },
  	firstName: {
      type: 'STRING',
      defaultsTo: ''
    },
    lastName: {
      type: 'STRING',
      defaultsTo: ''
    },
    gravatar: {
      type: 'url',
      defaultsTo: "http://icons.iconarchive.com/icons/visualpharm/icons8-metro-style/128/Printed-Matter-Newspaper-icon.png"
    },
    birthDate: {
      type: 'DATE'
    },
    score: {
    	type: 'INTEGER',
    	defaultsTo: 0
    },
    toJSON: function() {
    	var obj = this.toObject();
    	delete obj.password;
    	delete obj.confirmation;
    	delete obj.encryptedPassword;
    	delete obj._csrf;
    	return obj;
    }
  },

  beforeCreate: function (values, next) {
    console.log("boo");
    if (!values.password || values.password != values.confirmation) {
      return next({err: ["Password doesn't match password confirmation."]});
    }
    require('bcrypt').hash(values.password, 10, function passwordEncrypted(err, encryptedPassword) {
      if (err) return next(err);
      values.encryptedPassword = encryptedPassword;
      //values.online = true;
      next();
    });
  }

};
