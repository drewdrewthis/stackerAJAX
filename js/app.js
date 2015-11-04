$(document).ready( function() {
	$('.unanswered-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});

	$('.inspiration-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tag = $(this).find("input[name='answerers']").val();
		getAnswerers(tag);
	});
});

// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = {tagged: tags,
								site: 'stackoverflow',
								order: 'desc',
								sort: 'creation'};
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var template = document.getElementById('questions-template').innerHTML,
				date = new Date(1000*item.creation_date);
			
			item.date = date.toString();
			
			var output = Mustache.render(template,item);

			$('.results').append(output);
		});

		console.log(result.items);
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};

var getAnswerers = function(tag) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = {site: 'stackoverflow'};
	
	var result = $.ajax({
		url: "http://api.stackexchange.com//2.2/tags/"+tag+"/top-answerers/all_time",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){
		var searchResults = showSearchResults(tag, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {

			var template = document.getElementById('answerer-template').innerHTML,
				output = Mustache.render(template,item);

			$('.results').append(output);

		});

		console.log(result.items);
		
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};



