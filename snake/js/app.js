'use strict';

$(document).ready(function() {

	var FIELD = {
		length: 30,
		width: 30,
		/**
		 * Creates field. 
		 */
		create: function createField() {
			for (var i = 0; i < this.length * this.width; i++) {
				console.log('creatubng');
				$('#field').append('<div class="cell"></div>');
			}
		},
		/**
		 * Generates random cell number. 
		 * @returns {Number}
		 */
		randomCell: function getRandomCell() {
			var fieldArea = this.length * this.width;
			return Math.floor(Math.random() * (fieldArea + 1));
		},
	} || {};

	var GAME = {
		/**
		 * Starts game.
		 */
		init: function() {
			FIELD.create();
			INSECT.create();
			SNAKE.create();
		},
		/**
		 * Checks if snake is eating itself.
		 * @param {Array} snake - snake body
		 * @returns {Boolean}
		 */
		checkCrash: function checkCrash(snake) {
			if (snake.indexOf(snake[0], 1) !== -1) {
				return true;
			} else {
				return false;
			}
		},
		/**
		 * Counts game score. 
		 * @returns {Number}
		 */
		score: function countScore() {
			return (SNAKE.body.length - 1) * 10;
		},
	} || {};

	var INSECT = {
		body: [],
		/**
		 * Creates insect. 
		 */
		create: function createInsect() {
			var insectCell = FIELD.randomCell();
			while(SNAKE.body.indexOf(insectCell) !== -1) {
				insectCell = FIELD.randomCell();
			}
			this.body.push(insectCell)
			STYLE.insect(insectCell);			
		},
		/**
		 * Destroys insect. 
		 */
		die: function killInsect() {
			this.body = [];
			STYLE.clear('insect');
			return this;
		},
	} || {};

	var SNAKE = {
		/**
		 * Creates snake. 
		 */
		body: [],
		create: function createSnake() {
			var that = this;
			that.body.push(FIELD.randomCell());
			STYLE.snake(that.body);
			that.moveInt = setInterval(function(){
				that.move(that.body);
			}, 300);
			
		},
		/**
		 * Moves snake. 
		 * @param {Array} snake
		 */
		move: function moveSnake(snake) {

				var step = SNAKE.checkDir(snake);

				if(GAME.checkCrash(snake)){					
					clearInterval(this.moveInt);
					alert('Score: ' + GAME.score());
					SNAKE.die().create();					
					INSECT.die().create();
					return;					
				}

				if(SNAKE.eat()) {
					INSECT.die().create();
					SNAKE.grow(snake);
				}

				snake.unshift(snake[0] + step);
				snake.pop();
				STYLE.snake(snake);
		},
		moveInt: null,
		direction: 'right',
		/**
		 * Switches snake direction according to key-event. 
		 */
		switchDir: function switchDir(e) { 
			var direction = SNAKE.direction;
			var code = e.keyCode;
			switch (code) {
				case 38:
					if (direction !== 'down') SNAKE.direction = 'up';
					break;
				case 39:
					if (direction !== 'left') SNAKE.direction = 'right';
					break;
				case 40:
					if (direction !== 'up') SNAKE.direction = 'down';
					break;
				case 37:
					if (direction !== 'right') SNAKE.direction = 'left';
					break;
			}
		},
		/**
		 * Checks snake direction and returns appropriate step. 
		 * @param {Array} snake
		 * @returns {Number} step
		 */
		checkDir: function checkDir(snake) {
			var dir = this.direction;	
			var step;

			switch (dir) { 
				case 'up':
					step = (snake[0] < 30) ? 870 : -30;
					break;
				case 'down':
					step = (snake[0] < 870) ? 30 : -870;
					break;
				case 'left':
					step = (snake[0] % 30 === 0) ? 29 : -1;
					break;
				case 'right':
					step = ((snake[0] + 1) % 30 === 0) ? -29 : 1;
					break;
			}

			return step;
		},
		/**
		 * Checks if snake and insect met. 
		 * @returns {Boolean}
		 */
		eat: function snakeEat() {
			if (INSECT.body[0] == SNAKE.body[0]) {				
				return true;
			} else {
				return false;
			}
		},
		/**
		 * Makes snake grow. 
		 * @param {Array} snake
		 */
		grow: function snakeGrow(snake) {
			var last = snake[snake.length - 1];
      		snake.push(last + (last - snake[last - 1]));      		
      		STYLE.snake(snake);
		},
		/**
		 * Destroys snake. 
		 */
		die: function snakeDie() {
			this.body = [];
			STYLE.clear('snake');
			STYLE.clear('head');
			return this;
		},
	} || {};

	var STYLE = {
		/**
		 * Return field cells as JQuery object. 
		 * @returns {Object}
		 */
		cells: function getCells() {
			return $('.cell');
		},
		/**
		 * Adds CSS-class to chosen array (snake).
		 * @param {Array} snake 
		 */
		snake: function paintSnake(snake) {
			var that = this;
			that.clear('snake');
			that.clear('head');
			if (snake.length > 1) {
				snake.forEach(function(cell) {
					that.cells().eq(cell).addClass('snake');
				})
				that.cells().eq(snake[0]).addClass('head');
			} else if (snake.length > 0) {
				that.cells().eq(snake[0]).addClass('head');
			}
		},
		/**
		 * Adds CSS-class to chosen cell (insect).
		 * @param {Number} insectNum 
		 */
		insect: function paintInsect(insectNum) {
			this.cells().eq(insectNum).addClass('insect');
		},
		/**
		 * Removes CSS-class from field cells.
		 * @param {String} className 
		 */
		clear: function clearField(className) {
			this.cells().removeClass(className);
		}
	} || {};

	GAME.init();
	window.addEventListener('keydown', SNAKE.switchDir);

});