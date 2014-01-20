define(['event-bus', 'quiz-module', 'jquery', 'require', 'yepnope', 'modernizr'], function(EventBus, quiz, $, require, yepnope, Modernizr) {

	//Bower
	//Backbone
	//Collection for the questions
	//Model for the answers
	//View: rendering, binding
	//Mixin backbone's events


	return {
		init: function () {
			yepnope({
				'test': Modernizr.json,
				'yep': '2/src/json2.js',
				'nope': ''
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

