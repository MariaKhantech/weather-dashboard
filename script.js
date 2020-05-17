$(document).ready(function() {
	var weatherKey = 'ddaa6138c5246477932a6097adc5e7f3';


	function callWeatherDataApi(searchedCity) {
		var url = `https://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&appid=${weatherKey}`;
		return url;
		
		
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
			

			$.get(urlResponse).then(function(response) {
				console.log(response);
				
				//retrieves the temp response and places it into temp div//
				const tempResponse = response.main.temp;
				$("#temp").text(tempResponse);
				console.log(tempResponse);
				
				//retrieves the humidity response and places it into humid div//
				const humidityResponse = response.main.humidity;
				$("#humid").text(humidityResponse);
				console.log(humidityResponse);
		
				//retrieves the wind speed response and places it into wind div//
				const windSpeedResponse = response.wind.speed;
				$("#wind").text(windSpeedResponse);
				console.log(windSpeedResponse);
				
				//retrieves the location response and places it into location div//
				const locationResponse = response.name;
				
				//retrieves the icon response and places it into icon div//
				const iconResponse = response.weather[0].icon;
				var spanImageIcon = "<span><img src='http://openweathermap.org/img/wn/" + iconResponse + ".png'</img></span>";

				//getting current date//
				var m = moment();
				var dateformat = "<span>("+ m.format('L')+")</span>";

				$("#location").html(locationResponse + " " + dateformat +" " + spanImageIcon);
				

				console.log(iconResponse);
			});
			
		}
	});

	$('.parallax').parallax();

	//cloud animation js/
	$(function(){
		$("#myClouds").Klouds();
	});

});
