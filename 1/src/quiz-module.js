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

		Quiz.prototype.goToNext = function() {
			
		}

		Quiz.prototype.addEvents = function () {
			var _this = this;

			this.container.find('.previous').click(function(event) {
				event.preventDefault();
				event.stopPropagation();
				_this.goToNext($(this));
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
			this.container.find('.answers li').click(function(event) {

			});
			this.container.find('form').submit(function(event) {
				event.preventDefault();
				event.stopPropagation();
				APP.EventBus.trigger('quisFinished', _this.container, _this.countResult()); 
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