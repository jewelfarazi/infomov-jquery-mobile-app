// Initiate Variables
var movieInfo = {
	id : null,
	result : null
}

// ajax repsonse handler
var ajax = {
	parseJSONP : function(result) {
		movieInfo.result = result.results;
		// append each of movie data to the list
		$.each(result.results, function(i, row) {
			// if values = null
			var poster = (row.poster_path !== null) ? "http://image.tmdb.org/t/p/w92/"+row.poster_path : "http://dummyimage.com/80x120&text=No%20Image";
			var vote = (row.vote_average !== null) ? row.vote_average : "---";
			var rd = (row.release_date !== null) ? row.release_date.split("-").reverse().join("-") : '"---"'

			$('#movie-list').append('<li><a href="#" data-id="'+ row.id +'"><img src="'+ 
				poster +'"><h2>'+ row.title +'</h2><p><strong>Rating: '+ 
				vote + '/10</strong></p><p><strong>Rel. Date:</strong> '+ 
				rd +'</p></a></li>');
		});
		// refresh the total lists
		$('#movie-list').listview('refresh');
	}
}

// Themoviedb api url and endpoints
var api_url = 'http://api.themoviedb.org/3/',
	now_playing = 'movie/now_playing?',
	top_rated = 'movie/top_rated?',
	popular = 'movie/popular?',
	upcoming = 'movie/upcoming?',
	search_movie = 'search/movie?',
	api_key = 'api_key=c3510578883ca819e8954e6afc9accdd';

// Main ajax functionality
function getMovies(url, isPanel) {
	// using settimeout to fix loading issue
	setTimeout(function() {
		$.mobile.loading('show');
		$('.no-result-found').hide();
		if (isPanel) {
			$('#left-panel').panel('close');
			$('#movieName').val("");
		}
	}, 20);
	// remove old data
	$('#movie-list').empty();
	// Making the ajax calls to the api
	$.ajax({
		url: url,
		dataType: "jsonp",
		async: true,
		success: function(result) {
			//console.log(result);
			ajax.parseJSONP(result);
			// hide loader
			$.mobile.loading('hide');
			// if nothing found
			if ($.isArray(result.results) && result.results.length === 0) {
				$('.no-result-found').show();
			} else {
				$('.no-result-found').hide();
			}
		},
		error: function(x, t, m) {
		    // if ajax has error
		}
	});
}

// Init page page with default movie list
$(document).on('pageinit', '#home', function() {
	// geting movie data via ajax calls
	getMovies(api_url+now_playing+api_key, false);
	// Updating app title
	$('#movieAppHead').html('Now Playing');
});

// Initialize swipe menu
$( document ).on( "pagecreate", "#home", function() {
	$( document ).on( "swipeleft swiperight", "#home", function( e ) {
		// We check if there is no open panel on the page because otherwise
		// a swipe to close the left panel would also open the right panel (and v.v.).
		// We do this by checking the data that the framework stores on the page element (panel: open).
		if ( $( ".ui-page-active" ).jqmData( "panel" ) !== "open" ) {
			if ( e.type === "swipeleft" ) {
				$( "#right-panel" ).panel( "open" );
			} else if ( e.type === "swiperight" ) {
				$( "#left-panel" ).panel( "open" );
			}
		}
	});
});

// Loading specific movie info on click
$(document).on('pagebeforeshow', '#infopage', function(){   
	// remove older data   
    $('#movie-data').empty();
    $.each(movieInfo.result, function(i, row) {
        if(row.id == movieInfo.id) {
        	// if values = null
        	var poster = (row.poster_path !== null) ? "http://image.tmdb.org/t/p/w92/"+row.poster_path : "http://dummyimage.com/92x138&text=No%20Image";
			var vote = (row.vote_average !== null) ? row.vote_average : "---";
			var rd = (row.release_date !== null) ? row.release_date.split("-").reverse().join("-") : '"---"';
			var title = (row.original_title !== null) ? row.original_title : "---";
			var or_lang = (row.original_language !== null) ? row.original_language.toUpperCase() : "---";
			var overv = (row.overview !== null) ? row.overview : "No information available.";

			// removing older data from info page
        	$("#show-mv-img").empty();

        	$('#show-mv-img').append('<img class="m-info-fix" src="'+poster+'">');
        	$('#show-mv-img').append('<h2>'+ title +'</h2>');
            $('#movie-data').append('<li><strong>Language : '+ or_lang +'</strong></li>');
            $('#movie-data').append('<li><strong>Release date: '+ rd +'</strong></li>');
            $('#movie-data').append('<li><strong>Rating : '+vote+'/10</strong></li>');
            $('#movie-data').append('<li><strong>Overview :</strong> '+ overv +'</li>');

            // refresh all new data          
            $('#movie-data').listview('refresh');
        }
    });    
});

// Catch the specific movie click event and change the page to info
$(document).on('vclick', '#movie-list li a', function() {
	movieInfo.id = $(this).attr('data-id');
	// change to info page
	$.mobile.changePage('#infopage', { transition: "slide", changeHash: false });
});

// open about page
$(document).on('vclick', '#about', function() {
	// change to info page
	$.mobile.changePage('#aboutPage', { transition: "flip", changeHash: false });
});

// POST Find new movies on search
$(document).on('vclick', '#newSearch', function() {
	// search value
	var mname = $('#movieName').val();
	movieName = '&query='+encodeURI(mname);

	// geting movie data via ajax calls
	getMovies(api_url+search_movie+api_key+movieName, false);
	$('#movieAppHead').html('Movie List');
});

// GET now playing movies
$(document).on('vclick', '#getNowPlaying', function() {
	// geting movie data via ajax calls
	getMovies(api_url+now_playing+api_key, true);
	$('#movieAppHead').html('Now Playing');
});

// GET top rated movies
$(document).on('vclick', '#getTopRated', function() {
	// geting movie data via ajax calls
	getMovies(api_url+top_rated+api_key, true);
	$('#movieAppHead').html('Top Rated');
});

// GET popular movies
$(document).on('vclick', '#getPopular', function() {
	// geting movie data via ajax calls
	getMovies(api_url+popular+api_key, true);
	$('#movieAppHead').html('Popular');
});

// GET upcoming movies
$(document).on('vclick', '#getUpcoming', function() {
	// geting movie data via ajax calls
	getMovies(api_url+upcoming+api_key, true);
	$('#movieAppHead').html('Upcoming');
});

// About info
