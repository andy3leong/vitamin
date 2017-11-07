"use strict"

const util = require('util')
const OperationHelper = require('apac').OperationHelper
const parseString = require('xml2js').parseString;
const jsdom = require('jsdom');

let opHelper = new OperationHelper({
    awsId: 'AKIAIZCBKFUXMZMYR74A',
    awsSecret: '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',
    assocId: 'vitamn-20'
})

const operation = 'ItemSearch'
const params = {
    'SearchIndex': 'HealthPersonalCare',
    'Keywords': 'creatine',
    'ResponseGroup': 'Reviews,Images,ItemAttributes,OfferSummary',

    // 'Sort': 'salesrank' // best seller
    // 'Sort': 'pricerank' // best value

    //xml2jsOptions: {explicitArray: false}

    //'sort': 'ReviewRank, salesrank, pricerank'
}

opHelper.execute(operation, params).then((results, responseBody) => {
    var items = results.result.ItemSearchResponse.Items;
    console.log( "============" );
    var item = items[0].Item[0];
    console.log( "-------------" );
    console.log( item.DetailPageURL[0] );
    console.log( item.LargeImage[0].URL[0] );
    console.log( item.ItemAttributes[0].Title[0] );
    console.log( item.OfferSummary[0].LowestNewPrice[0].FormattedPrice[0] );
    console.log( item.CustomerReviews[0].IFrameURL[0] );


	jsdom.env(
	  item.CustomerReviews[0].IFrameURL[0],
	  ["http://code.jquery.com/jquery.js"],
	  function (err, window) {
	  	var $ = window.$;
	  	if ( $(".crIFrameError").length > 0 ) console.log( "No Review" );
	  	console.log( $(".crIFrameNumCustReviews img").attr('src') );
	    console.log( $(".crIFrameNumCustReviews a:nth-child(2)").text() ); // rating image
	  }
	);
    // image : item.LargeImage[0].URL[0]
    // title : item.ItemAttributes[0].title
    // price : item.OfferSummary[0].LowestNewPrice[0].FormattedPrice[0]

}).catch((err) => {
    console.error(err)
})