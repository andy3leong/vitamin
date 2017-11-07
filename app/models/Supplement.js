// grab the mongoose module
var mongoose = require('mongoose');

module.exports = mongoose.model('products', {
	name : String,
	lede : String,
	description : String,
	clinical : [{
		grade: String,
		topic: String,
		comments: String,
		rating: Number,
		change: [String],
		consensus: Number
	}],
	studies: [{
		link: String,
		title: String
	}],
	views: Number,
	favs: Number
});
