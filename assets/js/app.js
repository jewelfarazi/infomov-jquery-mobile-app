// Initiate Variables
var movieInfo = {
	id : null,
	result : null
}

var ajax = {
	parseJSONP : function(result) {
		movieInfo.result = result.results;
		// append each of movie data to the list
		$.each(result.results, function(i, row) {
			if (row.release_date !== null) {
				var rd = row.release_date.split("-").reverse().join("-");
			} else {
				var rd = "---";
			}
			$('#movie-list').append('<li><a href="#" data-id="'+ row.id +'"><img src="http://image.tmdb.org/t/p/w92/'+ row.poster_path +'"><h2>'+ row.title +'</h2><p><strong>Rating: '+ row.vote_average + '/10</strong></p><p><strong>Rel. Date:</strong> '+ rd +'</p></a></li>');
		});
		// refresh the total lists
		$('#movie-list').listview('refresh');
	}
}

// url for to get movie data from themoviedb
var url = 'http://api.themoviedb.org/3/',
	mode = 'search/movie?query=',
	movieName = '&query='+encodeURI('Star Wars'),
	key = '&api_key=c3510578883ca819e8954e6afc9accdd';

// Init page page with default movie list
$(document).on('pageinit', '#home', function() {
	// using settimeout to fix loading issue
	setTimeout(function() {
		$.mobile.loading('show');
	}, 20);

	// Making the ajax calls to the api
	$.ajax({
		url: url + mode + key + movieName,
		dataType: "jsonp",
		async: true,
		success: function(result) {
			ajax.parseJSONP(result);
			$.mobile.loading('hide');
		},
		error: function(req,err) {
			alert('Network error has occured please try again!');
		}
	});
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

// Initialize swipe menu
$( document ).on( "pagecreate", "#infopage", function() {
	$( document ).on( "swipeleft swiperight", "#infopage", function( e ) {
		// We check if there is no open panel on the page because otherwise
		// a swipe to close the left panel would also open the right panel (and v.v.).
		// We do this by checking the data that the framework stores on the page element (panel: open).
		if ( $( ".ui-page-active" ).jqmData( "panel" ) !== "open" ) {
			if ( e.type === "swipeleft" ) {
				$( "#right-panel" ).panel( "open" );
			} else if ( e.type === "swiperight" ) {
				$( "#left-panel2" ).panel( "open" );
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
        	$("#show-mv-img").empty();
        	$('#show-mv-img').append('<img class="m-info-fix" src="http://image.tmdb.org/t/p/w92/'+row.poster_path+'">');
        	$('#show-mv-img').append('<h2>'+ row.original_title +'</h2>');

            //$('#movie-data').append('<li><img class="m-info-fix" src="http://image.tmdb.org/t/p/w92/'+row.poster_path+'"></li>');
            //$('#movie-data').append('<li>Title: '+row.original_title+'</li>');
            if (row.release_date !== null) {
				var rd = row.release_date.split("-").reverse().join("-");
			} else {
				var rd = "---";
			}
            $('#movie-data').append('<li><strong>Language : '+row.original_language.toUpperCase()+'</strong></li>');
            $('#movie-data').append('<li><strong>Release date: '+ rd +'</strong></li>');
            $('#movie-data').append('<li><strong>Rating : '+row.vote_average+'/10</strong></li>');
            //$('#movie-data').append('<li><strong>Popularity : '+row.popularity+'</strong></li>');
            $('#movie-data').append('<li><strong>Overview :</strong> '+row.overview+'</li>');

            // refresh all new data          
            $('#movie-data').listview('refresh');
        }
    });    
});

// catch the specific movie click event and change the page to info
$(document).on('vclick', '#movie-list li a', function() {
	movieInfo.id = $(this).attr('data-id');
	// change to info page
	$.mobile.changePage('#infopage', { transition: "slide", changeHash: false });
});

// Find new movies on search
$(document).on('vclick', '#newSearch', function() {
	// using settimeout to fix loading issue
	setTimeout(function() {
		$.mobile.loading('show');
	}, 20);
	// remove old data
	$('#movie-list').empty();
	// search value
	var mname = $('#movieName').val();
	movieName = '&query='+encodeURI(mname),
	// Making the ajax calls to the api
	$.ajax({
		url: url + mode + key + movieName,
		dataType: "jsonp",
		async: true,
		success: function(result) {
			ajax.parseJSONP(result);
			$.mobile.loading('hide');
		},
		error: function(req,err) {
			alert('Network error has occured please try again!');
		}
	});
});