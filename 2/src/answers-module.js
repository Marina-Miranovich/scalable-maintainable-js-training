define(['jquery', 'underscore'], function($, _) {
	var results = {

		DEFAULTS: {
			path: 'results.json',
			resultTmpl: '<p><%= result %></p>'
						+ '<a href="/" class="one_more">Пройти еще раз</a>',
			cheatTmpl: '<p>Hmmm... Did you cheat?</p>'
				+ '<a href="/" class="one_more">Пройти еще раз</a>'
		},

		init: function ($container, result) {
			var _this = this;

			this.container = $container;
			this.count = result;

			$.getJSON(this.DEFAULTS.path)
				.success(function (result) {
					_this.resultsObject = result;
					_this.showResult();
				}).error(function (error) {
					console.log('?', error);
				});
		},

		showResult: function () {
			var len = this.resultsObject.length,
				i = 0,
				tmpl = this.DEFAULTS.resultTmpl;

			console.log('_    ', _);
			for (i; i < len; i++) {
				if (this.count <= this.resultsObject[i].to) {
					this.container.html(_.template(tmpl, {
						'result': this.resultsObject[i].status
					}));
					return;
				}
			}
			this.container.html(this.DEFAULTS.cheatTmpl);
		}
	};

	return {
		getResults: results.init.bind(results)
	};
});