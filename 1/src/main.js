var APP = APP || {};

(function ($) {
	$.fn.createQuiz = (function() {

		var Quiz = function() {};
		Quiz.prototype.DEFAULTS = {
			path: 'questions.json'
		};


		Quiz.prototype.getQuiz = function () {
			var _this = this;

			$.getJSON(this.options.path)
				.success(function (result) {
					_this.quizObject = result;
					_this.drawQuiz();
				}).error(function (error) {
					console.log('?', error);
				});
		};

		Quiz.prototype.getId = (function() {
			var id = 0;
			return function() {
				return id++;
			};
		})()

		Quiz.prototype.getQuestionHtml = function (questionObj, number, additional) {
			var html = '<li class="question '+ additional + '"><p>' + questionObj.question + '</p>' +
					'<ul class="answers">',
				length = questionObj.answers.length,
				i = 0;
			for (i; i < length; i ++) {
				html += this.getAnswerHtml(questionObj.answers[i], questionObj.points[i], number);
			}
			return html + '</ul></li>';
		};

		Quiz.prototype.getAnswerHtml = function (answer, points, n) {
			return '<li><input type="radio" name="question_' + n + '" value="'+ points + '">' +
		    '<label for="question_' + n + '">' + answer + '</label></li>';
		};

		Quiz.prototype.addEvents = function () {
			var _this = this;

			this.container.find('.previous').click(function(event) {
				event.preventDefault();
				event.stopPropagation();
				var $newOne = _this.container.find('.active').removeClass('active')
									.prev().addClass('active');
				_this.container.find('.next').show();
				_this.container.find('.submit_btn').hide();
				if (!$newOne.prev().length) {
					$(this).hide();
				}
			});
			this.container.find('.next').click(function(event) {
				event.preventDefault();
				event.stopPropagation();
				var $newOne = _this.container.find('.active').removeClass('active')
									.next().addClass('active');
				_this.container.find('.previous').show();
				if (!$newOne.next().length) {
					$(this).hide();
					_this.container.find('.submit_btn').show();
				}
			});
			this.container.find('form').submit(function(event) {
				event.preventDefault();
				event.stopPropagation();
				if (typeof _this.options.onSubmit === 'function') {
					_this.options.onSubmit( _this.container, _this.countResult() );
				} else {
					_this.container.html('<h3>Ваши результаты были столь блистательны, что их украл злобный'
						+ ' леприкон и спрятал в горшочке с сокровищами под радугой. Можете поискать'
						+ ' там, а можете пройти тест еще раз. Обещаем, мы будем бдительнее.</h3>'
						+ '<p><a href="/" class="one_more">Пройти еще раз</a>' );
				} 
			});
		};

		Quiz.prototype.countResult = function () {
			var result = 0;
			this.container.find('.answers input:checked').each(function () {
				result += parseInt(this.value);
			});
			return result;
		};

		Quiz.prototype.drawQuiz = function () {
			var i = 0,
				length = this.quizObject.length,
				additionalClass;
			quizHTML = '<form action=""><ol id="quiz_' + this.getId() +'">';
			for (i; i < length; i ++) {
				additionalClass = (i === 0) ? 'active' : '';
				quizHTML += this.getQuestionHtml(this.quizObject[i], i, additionalClass);
			}
			quizHTML += '</ol>'
				+ '<a href="#" class="previous">&lt; Назад</a>'
				+ '<a href="#" class="next">Вперед &gt;</a>'
				+ '<input type="submit" class="submit_btn" value="Узнать результаты!"/>'
				+ '</form>';
			this.container.append(quizHTML);
			this.addEvents();
		};

		return function (options) {
			return this.each(function () {
				var localQuiz = new Quiz();

				localQuiz.options = $.extend({}, localQuiz.DEFAULTS, options);
				localQuiz.container = $(this);
				localQuiz.getQuiz();
			});
		};
	})();

})(jQuery);

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

		return {
			getResults: results.init.bind(results)
		};
	})();

})(jQuery, window);

(function (w, $) {
	$('.quizContainer').createQuiz({'onSubmit': APP.ResultsModule.getResults});
})(window, jQuery);