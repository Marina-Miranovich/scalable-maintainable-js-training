define(['event-bus', 'quiz-module', 'jquery', 'require', 'yepnope', 'modernizr'], function(EventBus, quiz, $, require, yepnope, Modernizr) {

	return {
		init: function () {
			yepnope({
				'test': Modernizr.json,
				'yep': '',
				'nope': 'json2'
			});
			$('.quizContainer').createQuiz();
			EventBus.bind('quizFinished', this.loadAnswers.bind(this));
		},

		loadAnswers: function ($container, results) {
			require(['answers-module'], function (answers) {
				answers.getResults($container, results);
			});
		}
	};
});

