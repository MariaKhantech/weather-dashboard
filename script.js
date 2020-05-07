$(document).ready(function() {
	var weatherKey = 'ddaa6138c5246477932a6097adc5e7f3';

	var url = `https://api.openweathermap.org/data/2.5/weather?q=Boston&appid=${weatherKey}`;

	$.get(url).then(function(response) {
		console.log(response);

		//gathering weather data
		const nameResponse = response.name;
		console.log(nameResponse);

		const tempResponse = response.main.temp;
		console.log(tempResponse);

		const humidityResponse = response.main.humidity;
		console.log(humidityResponse);

		const windSpeedResponse = response.wind.speed;
		console.log(windSpeedResponse);

		const weatherResponse = response;
		console.log(weatherResponse);
	});
	//Using this reference https://howtodoinjava.com/jquery/jquery-detect-if-enter-key-is-pressed/ to enter input value//
	$('#search').keypress(function(event) {
		var keyPress = event.keyCode ? event.keyCode : event.which;
		if (keyPress == '13') {
		}
	});

	$('.parallax').parallax();
});
