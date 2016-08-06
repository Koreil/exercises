$(document).ready(function() {
	function weatherMaster(type) {
		var $display = $('.b-weather');
		var myKey = 'appid=94b7b2024d66ca66a1fd53683c0b5d1c'; // I need this key to use weather API
		// I want to show temperature, country, city and main status image

		var currentWeather = {
			_temp: '',
			_country: '',
			_city: '',
			_mainStatus: ''
		};


		function getData(url) {
			return new Promise(function(resolve, reject) {

				var location = $.getJSON(url, function(location) {
					return location;
				});

				if (location) {
					resolve(location);
				} else {
					var error = new Error('Today we have no weather at all.');
					reject(error);
				}
			});
		}

		getData('http://ip-api.com/json')
			.then(function(location) {
				currentWeather._country = location.country;
				currentWeather._city = location.city;

				var lat = Math.round(location.lat * 100) / 100;
				var lon = Math.round(location.lon * 100) / 100;
				var weatherRequest = 'http://api.openweathermap.org/data/2.5/weather?' + 'lat=' + lat + '&lon=' + lon + '&' + myKey;
				return weatherRequest;
			})
			.then(function(weatherRequest) {
				return getData(weatherRequest);
			})
			.then(function(weather) {
				switch (type) {
					case 'celsius':
						currentWeather._temp = Math.round(weather.main.temp - 273.15) + '&deg;C';
						break;

					case 'fahrenheit':
						currentWeather._temp = Math.round(weather.main.temp - 273.15) * 1.8 + 32 + '&deg;F';
						break;

				}


				currentWeather._mainStatus = weather.weather[0].main; 
		   		var status = weather.weather[0].description;


		   		$display.html(currentWeather._country + ', ' + currentWeather._city + ', ' + currentWeather._temp + ', ' + currentWeather._mainStatus);

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

			}).catch(function(error){
				console.log(error);
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