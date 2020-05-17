$(document).ready(function() {
	var weatherKey = 'ddaa6138c5246477932a6097adc5e7f3';

	function callWeatherDataApi(searchedCity) {
		var url = `https://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&units=imperial&appid=${weatherKey}`;
		return url;
	}

	function callUvIndexApi(latResponse, longResponse) {
		var uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${latResponse}&lon=${longResponse}&appid=${weatherKey}`;
		console.log(uvUrl);
		return uvUrl;
	}

	function callFiveDayApi(searchedCity) {
		var fiveDayApiUrl = `api.openweathermap.org/data/2.5/forecast?q=${searchedCity}&appid=${weatherKey}`;
		console.log(fiveDayApiUrl);
		return fiveDayApiUrl;
	}

	//Using this reference https://howtodoinjava.com/jquery/jquery-detect-if-enter-key-is-pressed/ to enter input value without a button//
	//This is where the user searches for the city based on enter key press//
	$('#search').keypress(function(event) {
		var keyPress = event.keyCode ? event.keyCode : event.which;
		if (keyPress == '13') {
			//Variable to collect input data//
			var searchInput = $('#search').val();
			//console.log(searchInput);

			//Empty search bar after hit enter//
			$('#search').val('');

			//Pull search information from API//
			var urlResponse = callWeatherDataApi(searchInput);

			//process the callWeatherDataApi response
			$.get(urlResponse).then(function(response) {
				console.log(response);
				//retrieves the temp response and places it into temp div//
				const tempResponse = response.main.temp;
				$('#temp').text(tempResponse);

				//retrieves the humidity response and places it into humid div//
				const humidityResponse = response.main.humidity;
				$('#humid').text(humidityResponse);

				//retrieves the wind speed response and places it into wind div//
				const windSpeedResponse = response.wind.speed;
				$('#wind').text(windSpeedResponse);

				//retrieves the location response and places it into location div//
				const locationResponse = response.name;
				$('#location').text(locationResponse);

				//retrieves the icon response and places it into icon div//
				const iconResponse = response.weather[0].icon;
				console.log(iconResponse);

				//retrieves latitude data//
				const latResponse = response.coord.lat;
				console.log(latResponse);

				//retrieves longitude data//
				const longResponse = response.coord.lon;
				console.log(longResponse);

				//retrieves UV index data//
				var recieveUvResponse = callUvIndexApi(latResponse, longResponse);

				//process the callUVIndexAPI response
				$.get(recieveUvResponse).then(function(response) {
					console.log(response);
					const valueIndex = response.value;
					$('#uvindex').text(valueIndex);
				});

				//  retrieves the 5 day api//
				var fiveDayResponse = callFiveDayApi(searchInput);

				$.get(fiveDayResponse).then(function(response) {
					console.log(response);
				});
				//create the icon
				var spanImageIcon =
					"<span><img src='http://openweathermap.org/img/wn/" + iconResponse + ".png'</img></span>";

				//getting current date//
				var m = moment();
				var dateformat = '<span>(' + m.format('L') + ')</span>';

				$('#location').html(locationResponse + ' ' + dateformat + ' ' + spanImageIcon);
			});
		}
	});

	$('.parallax').parallax();

	//cloud animation js/
	$(function() {
		$('#myClouds').Klouds();
	});
});
