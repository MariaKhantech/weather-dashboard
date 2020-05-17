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
		var fiveDayApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${searchedCity}&appid=${weatherKey}`;
		console.log(fiveDayApiUrl);
		return fiveDayApiUrl;
	}

	function populateWeatherData(searchInput) {
		//Pull search information from API//
		var urlResponse = callWeatherDataApi(searchInput);

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

				$('#fivedaycards').children().remove();

				//retrieves each day list of forecast//
				var day1 = response.list[0];
				var day2 = response.list[8];
				var day3 = response.list[16];
				var day4 = response.list[24];
				var day5 = response.list[32];

				var fiveDayArray = [ day1, day2, day3, day4, day5 ];

				fiveDayArray.forEach(function(day) {
					var divColumn = $('<div class="col s12 m3 l2"></div>');
					var divCard = $('<div class="card"></div');
					var divCardTitle = $(
						' <div class="card-title center">' + moment(day.dt_txt).format('L') + '</div>'
					);
					var cardImage = $(
						'<div class="card-image center"><img src="http://openweathermap.org/img/wn/' +
							day.weather[0].icon +
							'.png"></div>'
					);
					var cardContent = $(
						'<div class="card-content center"><p>Temp: <span>' +
							day.main.temp +
							'</span><span> &#8457;</span></p><p> humidity: <span>' +
							day.main.humidity +
							'</span><span>%</span></p></div>'
					);

					divCard.append(divCardTitle, cardImage, cardContent);
					divColumn.append(divCard);
					$('#fivedaycards').append(divColumn);
				});
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

	populateWeatherData('Boston');

	//Using this reference https://howtodoinjava.com/jquery/jquery-detect-if-enter-key-is-pressed/ to enter input value without a button//
	//This is where the user searches for the city based on enter key press//
	$('#search').keypress(function(event) {
		var keyPress = event.keyCode ? event.keyCode : event.which;
		if (keyPress == '13') {
			//Variable to collect input data//
			var searchInput = $('#search').val();

			//Empty search bar after hit enter//
			$('#search').val('');

			//put seearch input on search history list
			var searchValueElement = $('<a href="#" class="collection-item"></a>');
			searchValueElement.text(searchInput);
			$('.collection').prepend(searchValueElement);

			//call hte function to show the weather data
			populateWeatherData(searchInput);
		}
	});

	$(document).on('click', '.collection-item', function() {
		populateWeatherData(this.text);
	});

	$('.parallax').parallax();

	//cloud animation js/
	$(function() {
		$('#myClouds').Klouds();
	});
});
