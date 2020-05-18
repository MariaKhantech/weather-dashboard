$(document).ready(function() {
	var weatherKey = 'ddaa6138c5246477932a6097adc5e7f3';
	var searchHistoryArray;
	var isValidLocation;

	//Initialise the search history array
	initialiseSearchHistory();

	setFirstLocation();

	//pull data from localstorage if any
	function initialiseSearchHistory() {
		if (JSON.parse(localStorage.getItem('searchHistory'))) {
			searchHistoryArray = JSON.parse(localStorage.getItem('searchHistory'));
			searchHistoryArray.forEach(function(item) {
				var searchValueElement = $('<a href="#" class="collection-item"></a>');
				searchValueElement.text(item);
				$('.collection').prepend(searchValueElement);
			});
		} else {
			searchHistoryArray = [];
		}
	}

	//populate with last searched location otherwise default to boston
	function setFirstLocation() {
		if (searchHistoryArray.length > 0) {
			var lastSearched = searchHistoryArray[searchHistoryArray.length - 1];
			populateWeatherData(lastSearched);
		} else {
			//dafult to boston
			var searchValueElement = $('<a href="#" class="collection-item"></a>');
			searchValueElement.text('Boston');
			$('.collection').prepend(searchValueElement);
			searchHistoryArray.push('Boston');
			localStorage.setItem('searchHistory', JSON.stringify(searchHistoryArray));
			populateWeatherData('Boston');
		}
	}

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

	function getUVIndexColor(uvIndex) {
		if (uvIndex < 3) {
			return 'green';
		} else if (uvIndex >= 3 && uvIndex < 7) {
			return 'orange';
		} else {
			return 'red';
		}
	}

	function populateWeatherData(searchInput) {
		//Pull search information from API//
		var urlResponse = callWeatherDataApi(searchInput);

		$.get(urlResponse)
			.then(function(response) {
				isValidLocation = true;
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

				//retrieves latitude data//
				const latResponse = response.coord.lat;

				//retrieves longitude data//
				const longResponse = response.coord.lon;

				//retrieves UV index data//
				var recieveUvResponse = callUvIndexApi(latResponse, longResponse);

				//process the callUVIndexAPI response
				$.get(recieveUvResponse).then(function(response) {
					const valueIndex = response.value;
					$('#uvindex').text(valueIndex);
					$('#uvindex').css('background-color', getUVIndexColor(valueIndex));
				});

				//  retrieves the 5 day api//
				var fiveDayResponse = callFiveDayApi(searchInput);

				$.get(fiveDayResponse).then(function(response) {
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
							' <div class="card-title blue lighten-4 center">' +
								moment(day.dt_txt).format('L') +
								'</div>'
						);
						var cardImage = $(
							'<div class=" blue lighten-4 center"><img src="http://openweathermap.org/img/wn/' +
								day.weather[0].icon +
								'@2x.png"></div>'
						);
						var cardContent = $(
							'<div class="card-content blue lighten-4 center"><p>Temp: <span>' +
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
			})
			//catch the failure
			.fail(function() {
				isValidLocation = false;
			});
	}

	//Using this reference https://howtodoinjava.com/jquery/jquery-detect-if-enter-key-is-pressed/ to enter input value without a button//
	//This is where the user searches for the city based on enter key press//
	$('#search').keypress(function(event) {
		var keyPress = event.keyCode ? event.keyCode : event.which;
		if (keyPress == '13') {
			//Variable to collect input data//
			var searchInput = $('#search').val();

			//Empty search bar after hit enter//
			$('#search').val('');

			//call hte function to show the weather data
			populateWeatherData(searchInput);

			if (isValidLocation) {
				//pput the search term on the array//
				searchHistoryArray.push(searchInput);

				if (searchHistoryArray.length > 5) {
					searchHistoryArray.shift();
					$('.collection').children().last().remove();
				}

				//put seearch input on search history list
				var searchValueElement = $('<a href="#" class="collection-item"></a>');
				searchValueElement.text(searchInput);
				$('.collection').prepend(searchValueElement);

				//search term into local storage//
				localStorage.setItem('searchHistory', JSON.stringify(searchHistoryArray));
			}
		}
	});

	$(document).on('click', '.collection-item', function() {
		populateWeatherData(this.text);
	});

	$('.parallax').parallax();

	//cloud animation js/
	$('#myClouds').Klouds({
		speed: 8,
		cloudColor1: '#ffffff',
		cloudColor2: '#90caf9',
		bgColor: '#0d47a1'
	});
});
