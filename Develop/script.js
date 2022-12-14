//TODO = create geocoding api function to convert city name to lat/lon coordinates
// create fetch function for current weather
// create fetch function for 5 day forecast and display in respective card
// store previously searched cities in local storage and display them under the search button
var apiKey = "37bd46a2ae3b6a2e1299059e96677f72";
var cityInputEl = document.querySelector("#city-input");
var cityGeoInfo = {};
var cityWeatherInfo = {};

document.querySelector("#city-button").addEventListener("click" , function () {
    document.querySelector("#city-input").textContent="";
    userInput = document.querySelector("#city-input").value.split(' ').join('_');
    console.log(userInput);

    var geoCodingUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + userInput + "&limit=5&appid=37bd46a2ae3b6a2e1299059e96677f72";

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
                            var fiveDayData=[];
                            fiveDayData=getFiveDayWeather(cityWeatherInfo);
                            console.log(fiveDayData);
                        });
                    }});
                        });
                    }        
    })
    
})

var getFiveDayWeather = function (weatherInfo) {
    
    var recPointer = 0;
    var cityWeather = weatherInfo.list;

    var fiveDayData=[];

    while(recPointer < (cityWeather.length -1)) {
        //Get data for record pointed to by recPointer
        //Had to do it this way to ensure a new object was created everytime
        //otherwise we would have to deal with data bleed
        const dayData = {
            date: cityWeather[recPointer].dt_txt,
            icon: cityWeather[recPointer].weather[0].icon,
            temp: cityWeather[recPointer].main.temp,
            wind: cityWeather[recPointer].wind.speed,
            humidity: cityWeather[recPointer].main.humidity,
        }

        //Push the harvested record for this day onto the fiveDayData array
        fiveDayData.push(dayData);
        
        //Jump forward 8 records
        recPointer = recPointer + 8;
    }

    return fiveDayData;

};