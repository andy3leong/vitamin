module.exports = function(app) {
	var index = require('./controllers/index');

	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});

	app.post('/get-categories', index.getCategories);
	app.post('/get-supplement', index.getSupplementByName);
	app.post('/get-supplements-by-category', index.getSupplementsByCategory);
	app.post('/get-supplements-by-subcategory', index.getSupplementsBySubCategory);
	app.post('/get-supplements-by-keyword', index.getSupplementsByKeyword);
	app.post('/get-suggestions', index.getSuggestionsKeyword);

	app.post('/add-views', index.addViews);
	app.post('/add-favs', index.addFavs);
	app.post('/get-reviews', index.getReviews);

};