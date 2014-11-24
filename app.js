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
		var tags = $(this).find("input[name='answerers']").val();
		getTopAnswerers(tags);
	});



});// end document ready





// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showQuestion = function(question) {
	
	// clone our result template code
	var result = $('.templates .question').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the #views for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
													question.owner.display_name +
												'</a>' +
							'</p>' +
 							'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};


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
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};

var getTopAnswerers = function(tags) {
	alert('in top answeres '+ tags);

// the parameters we need to pass in our request to StackOverflow's API
	var request = {tagged: tags, // not sure how this is supposed to work - can't find doc on it anywhere
								site: 'stackoverflow',
								order: 'desc',
								sort: 'creation'};
	
	var result = $.ajax({
		//url: "http://api.stackexchange.com/2.2/questions/unanswered",
		///2.2/tags/{tag}/top-answerers/all_time - see example here and below - modified url as follows next
		///2.2/tags/python/top-answerers/all_time?site=stackoverflow with tag as python
		//url: "http://api.stackexchange.com/2.2/tags/{tag}/top-answerers/all_time",
		url: "http://api.stackexchange.com/2.2/tags/{tagged}/python/top-answerers/all_time",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})  // why no semicolon here?

	.done(function(result){
		alert('in done - found ' + result.items);
		//var searchResults = showSearchResults(request.tagged, result.items.length);
		var searchResults = 

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});


};

/* ************************

tag_score object returned by 

/tags/{tag}/top-answerers/{period} Get the top answer posters in a specific tag, either in the last month or for all time.

request format
/2.2/tags/{tag}/top-answerers/all_time?site=stackoverflow

{
  "user": {
    "reputation": 9001,
    "user_id": 1,
    "user_type": "registered",
    "accept_rate": 55,
    "profile_image": "https://www.gravatar.com/avatar/a007be5a61f6aa8f3e85ae2fc18dd66e?d=identicon&r=PG",
    "display_name": "Example User",
    "link": "http://example.stackexchange.com/users/1/example-user"
  },
  "post_count": 100,
  "score": 20
}

*/

