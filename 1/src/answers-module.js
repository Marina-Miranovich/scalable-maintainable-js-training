(function ($, w) {
	w.APP.ResultsModule = (function() {

		var results = {

			DEFAULTS: {
				path: 'results.json'
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
					i = 0;
				for (i; i < len; i++) {
					if (this.count <= this.resultsObject[i].to) {
						this.container.html('<p>' + this.resultsObject[i].status + '</p>'
							+ '<a href="/" class="one_more">Пройти еще раз</a>');
						return;
					}
				}
				this.container.html('<p>Hmmm... Did you cheat?</p>'
					+ '<a href="/" class="one_more">Пройти еще раз</a>');
			}
		};

		return function() {
			this.getResults = results.init.bind(results);
		};
	})();

})(jQuery, window);