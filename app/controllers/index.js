"use strict"

var categories = require('../../config/categories');
var _ = require('lodash');
var Supplement = require('../models/Supplement');

var promise = require('promise');
var util = require('util');
var OperationHelper = require('apac').OperationHelper
var parseString = require('xml2js').parseString;
var jsdom = require('jsdom');

exports.getCategories = function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	res.send( JSON.stringify( categories ) );
}

exports.getSupplementByName = function( req, res ) {
	res.setHeader('Content-Type', 'application/json');

	Supplement.findOne(
		{ 
			'name': req.body.name
		}, function( err, r ) {
			if ( err || !r ) return;

			var description = r.description.replace("\\n", "\n").trim();
			if ( description.indexOf( 'Summary' ) >= 0 ) description = description.substring(7).trim() // removing summary
			var small = {
				_id: r._id,
				name: r.name,
				description: description,
				studies: r.studies,
				clinical: r.clinical,
				views: r.views,
				favs: r.favs
			}
			res.send( JSON.stringify( small ) );
		}
	);
}

exports.getSupplementByID = function( req, res ) {
	res.setHeader('Content-Type', 'application/json');

	Supplement.findOne(
		{ 
			'id': req.body.id
		}, function( err, results ) {
			if ( err || !results ) return;

			var description = r.description.replace("\\n", "\n").trim();
			if ( description.indexOf( 'Summary' ) >= 0 ) description = description.substring(7).trim() // removing summary

			var small = {
				_id: r._id,
				name: r.name,
				description: description,
				studies: r.studies,
				clinical: r.clinical,
				views: r.views,
				favs: r.favs
			}
			res.send( JSON.stringify( small ) );
		}
	);
}

exports.getSupplementsByCategory = function( req, res ) {
	res.setHeader('Content-Type', 'application/json');
	var subcategories = categories[req.body.category];

	Supplement.find(
		{
			'clinical': {
				'$elemMatch': {
					'topic': {
						"$in": subcategories
					}
				}
			}
		}, function( err, results ) {
			if ( err || !results ) return;

			var small = _.map( results, function(r) { 
				return {
					_id: r._id,
					name: r.name,
					description: r.lede,
					views: r.views,
					favs: r.favs
				};
			} );
			res.send( JSON.stringify( small ) );
		}
	);
}

exports.getSupplementsBySubCategory = function( req, res ) {
	res.setHeader('Content-Type', 'application/json');

	var results = Supplement.find(
		{
			'clinical': {
				'$elemMatch': {
					'topic': categories[req.body.category][req.body.subcategory]
				}
			}
		}, function( err, results ) {
			if ( err || !results ) return;

			var small = _.map( results, function(r) { 
				var rating = 0;

				for( var p in r.clinical ) {
					if ( r.clinical[p].topic == req.body.subcategory ) {
						rating = Math.max( rating, r.clinical[p].rating );
					}
				}

				return {
					_id: r._id,
					name: r.name,
					description: r.lede,
					views: r.views,
					favs: r.favs,
					rating: -rating
				};
			} );

			small = _.sortBy(small, 'rating' );

			res.send( JSON.stringify( small ) );
		}
	);
}

exports.getSupplementsByKeyword = function( req, res ) {
	res.setHeader('Content-Type', 'application/json');
	Supplement.find(
		{
			'name': { '$regex': '.*'+req.body.keyword+'.*', '$options': 'i' }
		}, function( err, results ) {
			if ( err || !results ) return;

			var small = _.map( results, function(r) { 
				return {
					_id: r._id,
					name: r.name,
					description: r.lede,
					views: r.views,
					favs: r.favs
				};
			} );
			res.send( JSON.stringify( small ) );
		}
	);
}

exports.getSuggestionsKeyword = function( req, res ) {
	res.setHeader('Content-Type', 'application/json');
	Supplement.find(
		{
			'name': { '$regex': '.*'+req.body.keyword+'.*', '$options': 'i'}
		}, function( err, results ) {
			if ( !err ) {
				var suggestions = _.map( results, function( res ) {
					return res.name
				});

				res.send( JSON.stringify( suggestions ) );
			}
			else {
				res.send( JSON.stringify( [] ) );
			}
		}
	);
}

exports.addViews = function( req, res ) {
	Supplement.findOne(
		{ 
			'name': req.body.name
		}, function( err, result ) {
			if ( err || !result ) return;

			result.views = result.views || 0;
			result.views = result.views + 1;

			result.save( function() {
				res.send( "Okay" );
			});
			
		}
	);
}

exports.addFavs = function( req, res ) {
	Supplement.findOne(
		{ 
			'_id': req.body.id
		}, function( err, result ) {
			if ( err || !result ) return;

			result.favs = result.favs || 0;
			result.favs = result.favs + 1;

			result.save( function() {
				res.send( "Okay" );
			});
			
		}
	);
}

exports.getReviews = function( req, res ) {
	_getAWSAPdata( req.body.name, req.body.type ).then( (data) => {
		res.send( JSON.stringify( data ) );
	} );
};

// sort: review, salesrank, pricerank
function _getAWSAPdata( keyword, sort ) {
	

	let opHelper = new OperationHelper({
	    awsId: 'AKIAIZCBKFUXMZMYR74A',
	    awsSecret: '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',
	    assocId: 'vitamn-20'
	});

	const operation = 'ItemSearch'
	var params = null;

	/* if ( sort == 'review' ) {
		params = {
		    'SearchIndex': 'HealthPersonalCare',
		    'Title': keyword,
		    'ResponseGroup': 'Reviews,Images,ItemAttributes,OfferSummary',
		}
	}
	else { */
		params = {
		    'SearchIndex': 'HealthPersonalCare',
		    'Title': keyword,
		    'ResponseGroup': 'Reviews,Images,ItemAttributes,OfferSummary',
		    'Sort': sort

		    // 'Sort': 'salesrank' // best seller
		    // 'Sort': 'pricerank' // best value
		}
	// }

	return new Promise( ( resolve, reject ) => { 
		opHelper.execute(operation, params).then((results, responseBody) => {
		    var items = results.result.ItemSearchResponse.Items;
		    var item = items[0].Item[0];

		    var data = {};
		    data.url = item.DetailPageURL[0];
		    data.img = item.LargeImage[0].URL[0];
		    data.title = item.ItemAttributes[0].Title[0];
		    data.price = item.OfferSummary[0].LowestNewPrice[0].FormattedPrice[0];

			jsdom.env(
			  item.CustomerReviews[0].IFrameURL[0],
			  ["http://code.jquery.com/jquery.js"],
			  function (err, window) {
			  	var $ = window.$;
			  	if ( $(".crIFrameError").length > 0 ) {
			  		data.reviewimg = null;
			  		data.reviewcount = null;
			  	}
			  	else {
			  		data.reviewimg = $(".crIFrameNumCustReviews img").attr('src');
			  		data.reviewcount = $(".crIFrameNumCustReviews a:nth-child(2)").text();
			  	}

			  	resolve( data );
			  }
			);
		}).catch((err) => {
		    reject( err );
		});
	})
}