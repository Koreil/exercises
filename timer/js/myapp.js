
"use strict";

$(document).ready(function(){
  $.fn.timer = function(options){
    return this.each(function(){
      var $timerCnr = $(this);

      var settings = {
        workIntSource: 0, // нужно ли поле, чтобы определять интервал
        breakIntSource: 0, // нужно ли второе поле, чтобы определять интервал перерыва
        interval: 30, // интервал по умолчанию
      }
    
      if(options){
        $.extend(settings, options);
      }

      $timerCnr.append('<div class="b-timer"></div>');
      var $timer = $timerCnr.children('.b-timer');
      $timer.text('00 : 00 : 00');

      if(settings.workIntSource) {
        $timerCnr.append('<p class="easy"><span class="less">-</span><span class="value b-work__value">30</span><span class="more">+</span></p>');
      }

      if(settings.breakIntSource) {
        $timerCnr.append('<p class="easy"><span class="less">-</span><span class="value b-break__value">5</span><span class="more">+</span></p>');
      }


      var $lessBtn = $timer.siblings('.easy').children('.less');
      var $moreBtn = $timer.siblings('.easy').children('.more');
      var intID;
      var newInterval;

      var TIMER = {
        workInt: function() {
                if(settings.workIntSource) {
                  return $timer.siblings('.easy').children('.b-work__value').text()*60000; // in milliseconds; as method, because must be recalculated
                } else {
                  return settings.interval*60000;
                }
            },
        breakInt: function() {
                if(settings.breakIntSource) {
                  return $timer.siblings('.easy').children('.b-break__value').text()*60000; // in milliseconds; as method, because must be recalculated
                }
            },
        pauseFlag: false, // if timer was paused or not

        start: function (interval) {

            if(!TIMER.pauseFlag) {
              var end = new Date().getTime()+interval;
              intID = null;
            }
            

            function decr() {
              if(TIMER.pauseFlag) { // it timer was paused we need to refresh our interval (it's expiring)
                end = new Date().getTime() + newInterval - 1000;
                TIMER.pauseFlag = false;
              }
  
              var now = new Date();
              var diff = end - now;
              newInterval = diff;
              diff = diff/1000;
              var seconds = Math.round(diff%60); seconds = (seconds < 10) ? '0' + seconds : seconds; // it's just... beautiful with zero
              diff = diff/60;
              var minutes = Math.floor(diff%60); minutes = (minutes < 10) ? '0' + minutes : minutes;
              diff = diff/60;
              var hours = Math.floor(diff%24); hours = (hours < 10) ? '0' + hours : hours;

  
              if(diff < 0 && interval == TIMER.workInt()) {
                console.log('amusement time');
                if(settings.breakIntSource) {
                  interval = TIMER.breakInt();
                  end = new Date().getTime() + TIMER.breakInt();
                } else {
                  clearInterval(intID);
                  intID = null;
                  $timer.text('00 : 00 : 00');
                }
              }

              else if (diff < 0 && interval !== TIMER.workInt()) {
                console.log(interval);
                console.log('work time');
                interval = TIMER.workInt();
                end = new Date().getTime() + TIMER.workInt();
              }

              else {
                $timer.text(hours + ' : ' + minutes + ' : ' + seconds);
              }
    
  
          } //decr() ends

          
            intID = setInterval(decr, 1000);
          

      } // TIMER.start() ends
  }; //TIMER ends

  $lessBtn.click(function(){
    clearInterval(intID);
    intID = null;
    $timer.text('00 : 00 : 00');
    var $that = $(this);
    var currentVal = +($that.siblings('.value').text());
    if(currentVal > 0) {
      currentVal--;
      $that.siblings('.value').text(currentVal);
    }

  });

  $moreBtn.click(function(){
    clearInterval(intID);
    intID = null;
    $timer.text('00 : 00 : 00');
    var $that = $(this);
    var currentVal = +($that.siblings('.value').text());
    currentVal++;
    $that.siblings('.value').text(currentVal);
  });

  $timer.click(function() {
      if(!intID) {
        TIMER.start(TIMER.workInt());
      } else {
        TIMER.pauseFlag = true;
        clearInterval(intID);
        intID = null;
      }
      });

    }); // each
  }; // timer

  $('#b-settimer').timer({workIntSource: 1, breakIntSource: 1});
  $('#b-settimer1').timer({workIntSource: 1, breakIntSource: 0});

}); // ready


