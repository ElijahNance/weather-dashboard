//TODO = create geocoding api function to convert city name to lat/lon coordinates
// create fetch function for current weather
// create fetch function for 5 day forecast and display in respective card
// store previously searched cities in local storage and display them under the search button
var apiKey = "37bd46a2ae3b6a2e1299059e96677f72";



document.querySelector("#city-button").addEventListener("click" , async function () {
    await FetchAndDisplayData(null);
});

async function FetchAndDisplayData(cityName) {

    var cityInputEl = document.querySelector("#city-input");
    userInput = cityInputEl.value;

    if (cityName === null) {
        userInput = cityInputEl.value;
    } else {
        userInput = cityName;
    }

    cityInputEl.textContent="";
    console.log("Fetch Function:", userInput);

    var geoCodingUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + userInput + "&limit=5&appid=37bd46a2ae3b6a2e1299059e96677f72";

    var cityWeatherInfo = {};
    var cityCurrWeatherInfo={};

fetch(geoCodingUrl)
    .then(function (response) {
        if(response.ok) {
            response.json().then(function (data) {
                cityGeoInfo=data[0];
                console.log(cityGeoInfo.lat, cityGeoInfo.lon);

                var cityUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + cityGeoInfo.lat + "&lon=" + cityGeoInfo.lon + "&appid=37bd46a2ae3b6a2e1299059e96677f72&units=imperial";

                var currUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + cityGeoInfo.lat + "&lon=" + cityGeoInfo.lon + "&appid=37bd46a2ae3b6a2e1299059e96677f72&units=imperial";

                fetch(cityUrl)
                .then(function (response) {
                    if(response.ok) {
                        response.json().then(function (data) {
                            cityWeatherInfo = data;
                            console.log(cityWeatherInfo);
                            var fiveDayData=[];
                            fiveDayData=getFiveDayWeather(cityWeatherInfo);
                            console.log(fiveDayData);
                            displayFiveDayWeather(fiveDayData);
                        });
                    }});

                fetch(currUrl)
                .then(function (response) {
                    if(response.ok) {
                        response.json().then(function (data) {
                            console.log(data);
                            var currDayData = [];
                            cityCurrWeatherInfo = getCurrentWeather(data);
                            console.log(cityCurrWeatherInfo);
                            displaycurrDayWeather(cityCurrWeatherInfo, userInput);
                            })
                        }
                    })

                displayRecent(userInput);
                        });
                    }        
    })
}

var getCurrentWeather = function (weatherInfo) {

    var currDayData = [];

    var date = new Date(weatherInfo.dt * 1000);
    console.log(dayjs(date).format('MM/DD/YYYY'));

    const dayData = {
        date: weatherInfo.dt,
        icon: weatherInfo.weather[0].icon,
        temp: weatherInfo.main.temp,
        wind: weatherInfo.wind.speed,
        humidity: weatherInfo.main.humidity,
    }

    currDayData.push(dayData);
    console.log(currDayData);

    return dayData;

}

var getFiveDayWeather = function (weatherInfo) {
    
    var recPointer = 0;
    var cityWeather = weatherInfo.list;

    var fiveDayData=[];

    while(recPointer < (cityWeather.length -1)) {
        //Get data for record pointed to by recPointer
        //Had to do it this way to ensure a new object was created everytime
        //otherwise we would have to deal with data bleed
        const dayData = {
            date: formatWeatherDate(cityWeather[recPointer].dt),
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

}


var displayFiveDayWeather = function(fiveDayData) {
    
    console.log(document.readyState);

    for(var i = 0; i < fiveDayData.length; i++){

        document.getElementById("date" + (i + 1)).textContent=fiveDayData[i].date;
        var imgURL="http://openweathermap.org/img/wn/" + fiveDayData[i].icon + ".png";
        document.getElementById("icon" + (i + 1)).setAttribute("src", imgURL);
        document.getElementById("temp" + (i + 1)).textContent="Temperature: " + fiveDayData[i].temp;
        document.getElementById("wind" + (i + 1)).textContent="Wind: " + fiveDayData[i].wind;
        document.getElementById("humid" + (i + 1)).textContent="Humidity: " + fiveDayData[i].humidity;

    }
}

var formatWeatherDate = function(unixDate) {
    var date = new Date(unixDate * 1000);
    return dayjs(date).format('MM/DD/YYYY');
}
    
var displaycurrDayWeather = function (currDayData, cityName) {

    document.getElementById("currDay").textContent=cityName + " " + formatWeatherDate(currDayData.date);
    var currImgURL="http://openweathermap.org/img/wn/" + currDayData.icon + ".png";
    document.getElementById("currIcon").setAttribute("src", currImgURL);
    document.getElementById("currTemp").textContent="Temperature: " + currDayData.temp;
    document.getElementById("currWind").textContent="Wind: " + currDayData.wind;
    document.getElementById("currHumid").textContent="Humidity: " + currDayData.humidity;
    
}

var confirmRecentVisit = function (cityName, listOfRecentCities) {

    if(!Array.isArray(listOfRecentCities)) {
        console.log("No array of cities passed to confirmRecentVisit");
        return false;
    }

    for(var i=0; i < listOfRecentCities.length; i++) {
        
        if (cityName.toUpperCase() === listOfRecentCities[i].toUpperCase()) {
            //Found that this was a recent city - return true
            return true;
        }
    }

    //If you get this far, you didn't find anything - return false
    return false;
}

var displayRecent = function (cityName) {
    console.log("Display City:", cityName);

    var currStoredLocations = JSON.parse(localStorage.getItem('recent-search')) || [];

    console.log("Current Stored Locations:", currStoredLocations, typeof(currStoredLocations));

    //See if we've been here before and if we have, just bail
    if ((cityName.length > 0) && (!confirmRecentVisit(cityName, currStoredLocations))) {
        currStoredLocations.push(cityName);
        console.log("After Push", currStoredLocations);
        localStorage.setItem("recent-search" , JSON.stringify(currStoredLocations));
    }

    var recentLocationList = document.getElementById("recent");
    recentLocationList.innerHTML = null;

    for (i = 0; i < currStoredLocations.length; i++){
        var liveAnchor = "<a href=\"#\" onclick=\"FetchAndDisplayData('" + currStoredLocations[i] + "'); return false;\">" + currStoredLocations[i] + "</a>";
        console.log(liveAnchor);
        var li = document.createElement('li');
        li.innerHTML = liveAnchor;
        recentLocationList.appendChild(li);
    }
}

displayRecent("");