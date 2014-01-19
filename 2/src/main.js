define(['event-bus', 'quiz-module', 'jquery', 'require'], function(EventBus, quiz, $, require) {

	return {
		init: function () {
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

