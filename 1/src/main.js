var APP = APP || {};

// TODO create APP module, new file index.js. call APP.init();
(function (w, $) {
	$('.quizContainer').createQuiz();
	var output = new APP.ResultsModule();
	APP.EventBus.bind('quisFinished', output.getResults);

})(window, jQuery);