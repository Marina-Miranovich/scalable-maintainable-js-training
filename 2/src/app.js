//TODO: ask EventBus lines 14 and 36

require.config({
	'shim': {
		'underscore': {
			'exports': '_'
		},
		'yepnope': {
			'exports': 'yepnope'
		},
		'modernizr': {
			'exports': 'Modernizr'
		},
		'json2': {
			'exports': 'json2'
		}
	},
	'paths': {
		'jquery': '//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min',
		'require': '/2/src/requirejs',
		'underscore': '/2/src/underscore'
	}
});

require(['main'], function(APP) {
  APP.init();
});