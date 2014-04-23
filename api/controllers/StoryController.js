/**
 * StoryController
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
  	res.view('story/new');
  },
  create: function(req, res) {
  	var story = {};
  	var user = User.findOne(req.session.User.id, function(err, user) {
  		if(err) return err;
  		console.log(user);
  		story['title'] = req.param('title');
	  	story['author'] = user.id;
	  	story['body'] = req.param('body');
		
		if(req.param('tags')) story['tags'] = req.param('tags').split(",");
		if(req.param('images')) story['images'] = req.param('images').split(",");
		if(req.param('videos')) story['videos'] = req.param('videos').split(",");

	  	Story.create(story, function storyCreated(err, story){
	  		if(err) {
	  			console.log(err);
	  			req.session.flash = {
	  				err: err
	  			}
	  			return res.redirect('/story/new');
	  		} 
	      	res.redirect('/story/read/' + story.id)
	  	});
  	})
  },

  edit: function(req, res, next) {
    Story.findOne(req.param('id'), function editStory (err, story) {
      if(err) return next(err);
      if(!story) return next("Story doesn\'t exist.");
      res.view({
        story: story
      });
    });
  },

  update: function(req, res, next) {
    Story.update(req.param('id'), req.params.all(), function foundStory (err, story) {
      if(err) {
        console.log("In update "+err);
        req.session.flash = {
          err: err
        }
        res.redirect('/story/edit/' + req.param('id'));
      }
      res.redirect('/story/read/' + req.param('id'));
    });
  },

  read: function(req, res, next) {
  	Story.findOne(req.param('id'), function readStory (err, story) {
      	User.findOne({ id: story.author }, function(err, author) {
		  if(err) console.log(err);//return next(err);
	  		story.authorDisplayName = author.firstName + " " + author.lastName;
			story.views += 1;
			story.save(function(err) {
		 		if(err) return next(err);
		      	if(!story) return next();
		      	res.view({
		        	story: story
		      	});   
		    });
		});
    });
  },
  index: function(req, res, next) {
    Story.find(function foundStories (err, stories) {
      _.each(stories, function(story) {
      	User.findOne({ id: story.author }, function(err, author) {
		  if(err) console.log(err);//return next(err);
      		story.authorDisplayName = author.firstName + " " + author.lastName;
  			story.save(function(err) {
		 		if(err) return next(err); 
		      	res.view({
		        	stories: stories
		      	});   
		    });
		});
      });
    });
  },
  dashboard: function(req, res, next) {
    Story.find()
    .where({ author: req.session.User.id})
    .done(function foundStories (err, stories) {
      if(err) return next(err);
      res.view({
        stories: stories
      });
    });
  },
  publish: function(req, res, next) {
  	var published = {published: true};
  	Story.update(req.param('id'), published, function foundStory (err, story) {
      if(err) {
        console.log("In unpublish "+err);
        req.session.flash = {
          err: err
        }
        res.redirect(next);
      }
      res.redirect(req.header('Referer'));
    });
  },
  unpublish: function(req, res, next) {
  	var published = {published: false};
  	Story.update(req.param('id'), published, function foundStory (err, story) {
      if(err) {
        console.log("In unpublish "+err);
        req.session.flash = {
          err: err
        }
        res.redirect(next);
      }
      res.redirect(req.header('Referer'));
    });
  },
  upVote: function(req, res, next) {
  	
  	Story.findOne(req.param('id'), function upVote (err, story) {
      	if(err) console.log(err);//return next(err);
		if (story.author === req.session.User.id) {
  			var userIsAuthorError = [{name: 'userIsAuthorError', message: 'You cannot upvote youre own article.'}];
	  		req.session.flash = {
	  			err: userIsAuthorError
	  		}
	  		res.redirect(req.header('Referer'));
	  		return;
  		}
		if(story.voters.indexOf(req.session.User.id) === -1) {
			if(err) return next(err);
		    if(!story) return next();
			story.score += 10;
			story.voters.push(req.session.User.id);
			story.save(function(err) {	
		      	User.findOne(story.author, function(err, author) {
					if(err) return next(err);
					author.score += 10;
					author.save(function(err) {
						if(err) return next(err);	
						res.redirect('/story/read/' + story.id);
					});
				});
			});
		} else {
			console.log("author"); 
			res.redirect('/story/read/' + story.id);	
		}

    });
  
  },
  downVote: function(req, res, next) {
  	Story.findOne(req.param('id'), function upVote (err, story) {
      	if(err) console.log(err);//return next(err);
		if(story.voters.indexOf(req.session.User.id) != -1) {	
			story.score -= 10;
			story.voters.splice(story.voters.indexOf(req.session.User.id), 1);
			story.save(function(err) {
		 		if(err) return next(err);
		      	if(!story) return next();
		      	User.findOne(story.author, function(err, author) {
					if(err) return next(err);
					author.score -= 10;
					author.save(function(err) {
						if(err) return next(err);
						res.redirect('/story/read/' + story.id);
					});
				});   
			});
		} else {
			console.log("oops"); 
			res.redirect('/story/read/' + story.id);	
		}
    });
  },  

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to StoryController)
   */
  _config: {}

  
};
