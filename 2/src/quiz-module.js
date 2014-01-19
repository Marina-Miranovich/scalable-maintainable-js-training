define(['event-bus', 'jquery', 'underscore'], function(EventBus, $, _) {

	$.fn.createQuiz = (function() {

		var Quiz = function() {};

		Quiz.prototype.DEFAULTS = {
			path: 'questions.json',
			quizTmpl: '<form action=""><ol id="<%= id %>">'
				+ '<% _.each(questions, function(question, mainIndex) { %>'
				+ '<li class="question <% if (mainIndex === 0) {print("active");} %>">'
				+   '<p><% print(mainIndex + 1); %>. <%= question.question %></p>'
				+   '<ul class="answers">'
				+     '<% _.each(question.answers, function(answer, index) { %>'
				+     '<li>'
				+       '<input type="radio" name="question_<%= mainIndex %>" value="<%= question.points[index] %>">'
				+       '<label for="question_<%= mainIndex %>"><%= answer %></label>'
				+     '</li>'
				+     '<% }); %>'
				+    '</ul>'
				+ '</li><% }); %></ol>'
				+ '<a href="#" class="previous">&lt; Назад</a>'
				+ '<a href="#" class="next">Вперед &gt;</a>'
				+ '<input type="submit" class="submit_btn" value="Узнать результаты!"/>'
				+ '</form>'
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
		})();

		Quiz.prototype.goToNext = function($item) {
			var $newOne = this.container.find('.active').removeClass('active')
									.prev().addClass('active');
			this.container.find('.next').show();
			this.container.find('.submit_btn').hide();
			if (!$newOne.prev().length) {
				$item.hide();
			}
		};

		Quiz.prototype.addEvents = function () {
			var _this = this;

			this.container.find('.previous').click(function(event) {
				event.preventDefault();
				event.stopPropagation();
				_this.goToNext($(this));
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
			this.container.find('.answers li').click(function() {
				console.log(this.tagName);
				if (this.tagName === 'input') {
					return;
				}
				var $checkbox = $(this).find('input'),
					isChecked = $(this).find('input').prop('checked');

				$checkbox.prop('checked', !isChecked);
			});
			this.container.find('form').submit(function(event) {
				event.preventDefault();
				event.stopPropagation();
				EventBus.trigger('quizFinished', _this.container, _this.countResult());
			});
		};

		Quiz.prototype.countResult = function () {
			var result = 0;
			this.container.find('.answers input:checked').each(function () {
				result += parseInt(this.value, 10);
			});
			return result;
		};

		Quiz.prototype.drawQuiz = function () {
			var tmpl = _.template(this.options.quizTmpl, {
				'questions': this.quizObject,
				'id': this.getId()
			});
			this.container.append(tmpl);
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

	return $.fn.createQuiz;

});
