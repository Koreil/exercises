$(document).ready(function(){
	var FIELD = { // характеристики самого поля
		height: 3,
		width: 3,
		create: function() {
			for(var i = 0; i < FIELD.width*FIELD.height; i++) {
				$('#b-field').append('<div class="cell"></div>');
			}
          return $('.cell');
		}
	};

  
    var $cells = FIELD.create(); // создаю поле и записываю все доступные ячейки

	var sign = 'X'; // По умолчанию игрок ходит крестиком
  	var AIsign = 'O';

    function firstMove() {
      $cells.eq(4).addClass('ready').append(AIsign);
      indexesAI.push(4);
    }
  
	function isReady(cell) {
      if(cell.hasClass('ready')) {
        return true;
      }
      
      else {
        return false;
      }
    }

	function move(cell, sign, indexes) {
		if(!isReady(cell)) {
			cell.addClass('ready');
			cell.append(sign);
			indexes.push(cell.index()); 
			
			if(!checkTie() && !check(indexesPlayer)) {
	    		moveAI(indexesPlayer, indexesAI);		
	    	}

	    	else if(check(indexesPlayer)) {
	    		alert('You win!');
	    		restart();
	    		firstMove();
	    	}	 
		}
		else {
			alert('Неверный ход');
		}      
	}

	var winCombos = [ // при каких комбинациях игра окончена
      [0, 1, 2], 
      [3, 4, 5], 
      [6, 7, 8], 
      [0, 3, 6], 
      [1, 4, 7], 
      [2, 5, 8], 
      [0, 4, 8], 
      [2, 4, 6]
    ];  

	var indexesPlayer = []; // здесь будут записаны ходы игрока
	var indexesAI = []; // здесь будут записаны ходы компа

    function restart() { // перезагрузка поля (выиграно или ничья)
      $('#b-field').children().removeClass('ready');
      $('#b-field').children().text('');
      console.log('restart');
      indexesPlayer = [];
      indexesAI = [];
     
    }
  
    function checkTie() { // функция проверки на ничью
       var readyCells = $cells.filter(function(index){
         return isReady($cells.eq(index));  
       });
      
      if($cells.length == readyCells.length) { // если все ячейки имеют класс ready     
        alert('tie');
        restart();   
        firstMove();
        return true;
      }
      
      else {
        return false;
      }
    }
  
	function check(indexes) { // функция проверки на выигрыш
		var wins = winCombos.filter(function(combo){
			return combo.filter(function(index){
				return indexes.indexOf(index) !== -1;
			}).length == 3;
		});

		if(wins.length) {			                   
			return true;
		}

		else {
			return false;
		}
	}

	function checkPossible(array) { 
		var result = [];
        winCombos.forEach(function(combo){
          result.push(combo.filter(function(index){
            return array.indexOf(index) == -1; // оставляем в комбинациях только те индексы, соотв. которым ячейки пусты
          }));
        });
		
  		return result.filter(function(combo) {
          return combo.length == 1; // возвращаем комбинации, в которых не хватает только одной ячейки, чтобы заполнить ряд
        }).reduce(function(a,b){
          return a.concat(b);
        },[]).filter(function(index) {
        	return !isReady($cells.eq(index)); // важно проверить, не стоит ли там значка противника
        });		
	}

	function getRandomCell() {
		var randomCellNum = Math.floor(Math.random() * 9);

		while($cells.eq(randomCellNum).hasClass('ready') && !checkTie()) { // искать случайную пустую ячейку (убедиться, что не все заполнены)
			randomCellNum = Math.floor(Math.random() * 9);
			console.log(randomCellNum);
		}

		return randomCellNum;
	}

	function moveAI(indexesPlayer, indexesAI) {
		var AIpossible = checkPossible(indexesAI); // сюда будут записаны значения (если есть), которых ИИ не хватает до выигрыша
		var possibleWin = checkPossible(indexesPlayer); // сюда будут записаны значения (если есть), которых игроку не хватает до выигрыша
		var target; // будущая ячейка для хода
		
		
		console.log(AIpossible);
		console.log('possibleP:'+AIpossible);

  		if(AIpossible.length) {
  			target = $cells.eq(AIpossible[0]); 
  			console.log(target);
			indexesAI.push(AIpossible[0]);
			AIpossible.length = [];
		}

		else if(possibleWin.length) { // если "почти выигранные" игроком комбинации есть
			target = $cells.eq(possibleWin[0]); 
			indexesAI.push(possibleWin[0]);
			possibleWin = [];
			console.log('playercanwin');
		}
	

		else {	

		var randomNum = getRandomCell();		
			target = $cells.eq(randomNum);
			indexesAI.push(randomNum);
			console.log('we need randomNum');
		}

		target.addClass('ready');
		target.append(AIsign);	
        if(check(indexesAI)) {       	
        	alert('AI wins');
        	restart();
        	firstMove();
        }

        checkTie();


	}
    
	$('.cell').click(function(){
       	var $that = $(this);    
		move($that, sign, indexesPlayer);
	});

	$('.b-choicelist__sign').click(function(){
		var $that = $(this);
		sign = $that.text();
		AIsign = $that.siblings('.b-choicelist__sign').text();
		$('.shadow').hide();
		firstMove();
	});


});