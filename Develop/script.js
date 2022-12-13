//TODO = create geocoding api function to convert city name to lat/lon coordinates
// create fetch function for current weather
// create fetch function for 5 day forecast and display in respective card
// store previously searched cities in local storage and display them under the search button
var apiKey = "37bd46a2ae3b6a2e1299059e96677f72";
var cityInputEl = document.querySelector("#city-input");
var cityGeoInfo = {};
var cityWeatherInfo = {};

var userInput = function() {
    var city = cityInputEl.ariaValueMax.trim();

};


// var geoCoding = function () {

    

document.querySelector("#city-button").addEventListener("click" , function () {
    var geoCodingUrl = "http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=37bd46a2ae3b6a2e1299059e96677f72";

fetch(geoCodingUrl)
    .then(function (response) {
        if(response.ok) {
            response.json().then(function (data) {
                cityGeoInfo=data[0];
                console.log(cityGeoInfo.lat, cityGeoInfo.lon);

                var cityUrl = "http://api.openweathermap.org/data/2.5/forecast?lat=" + cityGeoInfo.lat + "&lon=" + cityGeoInfo.lon + "&appid=37bd46a2ae3b6a2e1299059e96677f72";

                fetch(cityUrl)
                .then(function (response) {
                    if(response.ok) {
                        response.json().then(function (data) {
                            cityWeatherInfo = data;
                            console.log(cityWeatherInfo);
                        });
                    }});
                        });
                    }        
    })
    
    // var cityUrl = "api.openweathermap.org/data/2.5/forecast?lat=" + cityGeoInfo.lat + "&lon=" + cityGeoInfo.lon + "&appid=37bd46a2ae3b6a2e1299059e96677f72";

    // fetch(cityUrl)
    // .then(function (response) {
    //     if(response.ok) {
    //         response.json().then(function (data) {
    //             console.log(data);
    //         });
    //     }})
})