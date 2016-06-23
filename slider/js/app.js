"use strict";

$(document).ready(function() {				
  $.fn.mySlider = function(options) {
      var settings = {
        rotateBy: 1, // по умолчанию - 1 слайд
        speed: 1000, // секунда по умолчанию
        direction: 1, // 1 - вперед, 2 - назад
        auto: true, // автопрокрутка
        buttons: 0,
        btnLeft: 0,
        btnRight: 0        
      };  
    
    
    return this.each(function() {
      if(options){
        $.extend(settings, options);
      }

      var $this = $(this);
      var $slides = $this.children();
      var slideWidth = $this.children().eq(0).outerWidth(); // предполагается, что все слайды одной ширины
      var slideHeight = $slides.eq(0).outerHeight();
      var animFlag = false;   
      var intID = null;
      var $container = $this.parent();  

      $this.css({ // на случай, если свойства не прописаны (они необходимы)
        'height': $this.children().outerHeight(),
        'width': slideWidth * $slides.length,
        'position': 'absolute',
        'left': '0'
      });

      $container.css({
        'position' : 'relative',
        'height': slideHeight,
        'width': slideWidth,
        'overflow': 'hidden',
      }).addClass('clearfix');

      $this.children().css({
        'float': 'left',
      });
      
      
      function slide(rotateBy, speed, dir) {
        if(!dir) {
          dir = settings.direction;
        }

        if(!rotateBy) {
          rotateBy = settings.rotateBy;
        }

        if(!speed) {
          speed = settings.speed;
        }

        function lightButton() {
          var targetButton = buttons.eq($this.children(':first').data('item')); 
          buttons.removeClass('active');
          targetButton.addClass('active');
          console.log(buttons);
        }

        if(!animFlag){
          animFlag = true;          

          if(dir == 1) {
            $this.children(':last').after($this.children().slice(0, rotateBy).clone());
            $this.animate({left: -slideWidth * rotateBy}, speed, function(){
              
              $this.children().slice(0, rotateBy).remove();
              $this.css({left: 0});
              animFlag = false;
              if(settings.buttons){
               lightButton();
              } 
            });
          } else {
              $this.children(':first').before($this.children().slice($this.children().length - rotateBy, $this.children().length).clone());
              $this.css({left: -slideWidth * rotateBy});
              $this.animate({left: 0}, speed, function(){         
                  $this.children().slice($this.children().length - rotateBy, $this.children().length).remove();   
                  animFlag = false;  
                  if(settings.buttons){
               		lightButton();
              	   }          
                });
            }         
          }
        } // slide ends


     if(settings.auto) {
        intID = window.setInterval(function(){ slide();}, 3000);
     } 

     if(settings.buttons) {
         $container.append('<ul class="b-slider__switch"></ul>'); 
         var buttonsCnr = $container.children('.b-slider__switch');

         for(var i=0; i < $slides.length; i++) {
            buttonsCnr.append('<li class="b-switch__button g-left"></li>'); 
         }

         var buttons = buttonsCnr.children();
         buttons.eq(0).addClass('active');
         buttons.click(function() {            

            if (intID) { 
              window.clearInterval(intID);               
            }

            var slideNum = $this.children(':first').data('item');
            if($(this).index() !== slideNum) {
              var diff = $(this).index() - slideNum;
              if(diff > 0) {               
                slide(diff, 1000, 1);                
              } else {
                slide(-(diff), 1000, 2);  
              }
            }

         });
        } // генерация кнопок

       if(settings.btnLeft) {
        $container.append('<a class="larr"></a>');
        var btnLeft = $container.children('.larr');
        btnLeft.click(function() {
          if (intID) { 
              window.clearInterval(intID);               
            }
          slide(1, 500, 2);  
        });
       } 

       if(settings.btnRight) {
        $container.append('<a class="rarr"></a>');
        var btnRight = $container.children('.rarr');
        btnRight.click(function() {          
          if (intID) { 
              window.clearInterval(intID);               
            }

          slide(1, 500, 1);  
        });
       } 
      
      
    });
    
    
  };


  $('.b-slider__slides').mySlider({buttons: 1});
});