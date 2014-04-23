/**
 * Story
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	title: 'STRING',
  	author: 'STRING',
    authorDisplayName: 'STRING',
  	body: 'TEXT',
  	tagLine: 'STRING',
  	tags: 'ARRAY',
  	videos: 'ARRAY',
  	images: 'ARRAY',
  	score: {
      type: 'INTEGER',
      defaultsTo: 0
    },
    views: {
      type: 'INTEGER',
      defaultsTo: 0
    },
    comments: {
      type: 'INTEGER',
      defaultsTo: 0
    },
    published: {
      type: 'BOOLEAN',
      defaultsTo: false
    },
    voters: {
      type: 'ARRAY',
      defaultsTo: []
  	}
  }

};
