var fs = require("fs");
var Handlebars = require("handlebars");
var _ = require('underscore');
var moment = require('moment');

module.exports = {
	render: render
};

function render(resume) {
	var css = fs.readFileSync(__dirname + "/style.css", "utf-8");
	var template = fs.readFileSync(__dirname + "/resume.template", "utf-8");
	var date_format = 'MMM YYYY';

	_.each( resume.work, function( work_info ) {
		var start_date = work_info.startDate && new Date( work_info.startDate ),
				end_date = work_info.endDate && new Date( work_info.endDate );

		if ( start_date ) {
			work_info.startDate = moment( start_date ).format( date_format );
		}

		if ( end_date ) {
			work_info.endDate = moment( end_date ).format( date_format );
		}
	});

	_.each( resume.education, function( education_info ) {
		_.each( [ 'startDate', 'endDate' ], function ( date ) {
			var date_obj = new Date( education_info[ date ] );

			if ( education_info[ date ] ) {
				education_info[ date ] = moment( date_obj ).format( date_format );
			}
		});
	});

	_.each( resume.awards, function( award_info ) {
		if ( award_info.date ) {
			award_info.date = moment( new Date( award_info.date ) ).format( date_format )
		}
	});

	_.each( resume.publications, function( publication_info ) {
		if ( publication_info.releaseDate ) {
			publication_info.releaseDate = moment( new Date( publication_info.releaseDate ) ).format( 'MMM DD, YYYY' )
		}
	});

	_.each( resume.volunteer, function( volunteer_info ) {
		_.each( [ 'startDate', 'endDate' ], function ( date ) {
			var date_obj = new Date( volunteer_info[ date ] );

			if ( volunteer_info[ date ] ) {
				volunteer_info[ date ] = moment( date_obj ).format( date_format );
			}
		});
	});


	return Handlebars.compile(template)({
		css: css,
		resume: resume
	});
}

Handlebars.registerHelper("nl2br", function(value) {
	return (value || "").replace(/\n/g, "</p><p>");
});
