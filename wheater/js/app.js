$(document).ready(function() {
	function weatherMaster(type) {
    var $display = $('.b-weather');
    // location data
    var country;
    var city;
    var lat;
    var lon;
    var myKey = 'appid=94b7b2024d66ca66a1fd53683c0b5d1c';

    // weather data
    var temp;
    var mainStatus;

    $.getJSON('http://ip-api.com/json', function(location){
        country = location.country;
        city = location.city;
        lat = Math.round(location.lat * 100)/100;
        lon = Math.round(location.lon * 100)/100;

        var weatherRequest = 'http://api.openweathermap.org/data/2.5/weather?' + 'lat=' + lat + '&lon=' + lon + '&' + myKey; 

      $.getJSON(weatherRequest, function(weather) {
        switch(type) {
          case 'celsius':
          temp = Math.round(weather.main.temp - 273.15) + '&deg;C';
          break;

          case 'fahrenheit':
          temp = Math.round(weather.main.temp - 273.15) * 1.8 + 32 + '&deg;F';
          break;

        }

        
        
        mainStatus = weather.weather[0].main; 
        var status = weather.weather[0].description;


        switch(status) {
          case 'clear sky':
          $display.css({'background-image' : 'url(http://openweathermap.org/img/w/01d.png)'});
          break;

          case 'few clouds':
          $display.css({'background-image': 'url(http://openweathermap.org/img/w/02d.png)'});
          break;

          case 'scattered clouds':
          $display.css({'background-image': 'url(http://openweathermap.org/img/w/03d.png)'});
          break;

          case 'broken clouds':
          $display.css({'background-image': 'url(http://openweathermap.org/img/w/04d.png)'});
          break;

          case 'shower rain':
          $display.css({'background-image': 'url(http://openweathermap.org/img/w/09d.png)'});
          break;

          case 'rain':
          $display.css({'background-image': 'url(http://openweathermap.org/img/w/10d.png)'});
          break;

          case 'thunderstorm':
          $display.css({'background-image': 'url(http://openweathermap.org/img/w/11d.png)'});
          break;

          case 'snow':
          $display.css({'background-image': 'url(http://openweathermap.org/img/w/13d.png)'});
          break;

          case 'mist':
          $display.css({'background-image': 'url(http://openweathermap.org/img/w/50d.png)'});
          break;

          default:
          $display.css({'background-image': 'url(http://openweathermap.org/img/w/50d.png)'});
          break;

        }

        // console.log(temp);

        $display.html(country + ', ' + city + ', ' + temp + ', ' + mainStatus);
      });

     });

  }

  weatherMaster('celsius');

  $('#fahrenheit').click(function(){
    weatherMaster('fahrenheit');
  });

  $('#celsius').click(function(){
    weatherMaster('celsius');
  });

  	
});
  	