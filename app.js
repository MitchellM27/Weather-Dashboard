const apiKey = '0b7999a7a7259939a6725a84474f3fd3';
var searchButton = $(".searchBtn");
var searchCity = $("#cityInput");
var citiesListEl =$("#prevCityList");
var citiesList = [];

function init(){
    var storedCitiesList = JSON.parse(localStorage.getItem("citiesList"));

    // If cities were retrieved from localStorage, update the cities array to it
    if (storedCitiesList !== null) {
        citiesList = storedCitiesList;
      }

    renderCitiesEl();
}

init();

//Storing the list of cities
function storeCityList(){
   localStorage.setItem("citiesList", JSON.stringify(citiesList));
 }  

//adding input cities to the list
searchButton.on("click", function(event) {
    event.preventDefault();
    var city = searchCity.val().trim();

    if (citiesList.includes(city)){
        return false;
    } else {
        citiesList.push(city);
    }

    storeCityList();
    renderCitiesEl();

    var weatherURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey + '&units=imperial';
    var forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid='+ apiKey;


    fetch(weatherURL)
    .then(response => {
        return response.json();
    }).then (data => {
        console.log(data)
        var conditions = (data.weather['0'].main)
        var lat = (data.coord.lat)
        var long = (data.coord.lon)

        var today = moment();
        var iconToday = $("<i>")
        var currentD =$("#currentDay")
        $("#currentWeather").attr("class", "card");
        $("#currentDay").text(city + ": " + today.format("MMM Do, YYYY"));
        $("#temp").text("Temp: " + data.main.temp + "°F");
        $("#wind").text("Wind: " + data.wind.speed + "MPH");
        $("#humidity").text("Humidity: " + data.main.humidity + " %");
        currentD.append(iconToday);

        if (conditions === "Clouds") {
            iconToday.attr("class", "fa-cloud ")
        }else if (conditions === "Clear") {
            iconToday.attr("class", "fas fas-sun")
        }else {
            iconToday.attr("class", "fas fa-cloud-rain")
        }



    }).catch (err => {
        console.error(err);
    });

    fetch(forecastURL)
    .then(response => {
        return response.json();
    }).then (data => {
        console.log(data)
        for (i=0; i<5; i++) {
            var forecastIcon = $("</i>")
            var forecastLoopint = ("#forecastDay"+i)
            var forecastD = $(forecastLoopint)
            $("#forecast").attr("class", "card");
            $("#forecastDay"+i).text(city + ": " + data.list[(i)*8]["dt_txt"]);
            //convert temp from Kelvin
            fTemp= parseInt(((data.list[(i)*8].main.temp)-273)* (9/5) +32);
            $("#temp"+i).text("Temp: " + fTemp + "°F");
            $("#wind"+i).text("Wind: " + data.list[(i)*8].wind.speed + "MPH");
            $("#humidity"+i).text("Humidity: " + data.list[(i)*8].main.humidity + " %");

            forecastConditions = (data.list[(i)*8].weather["0"]["main"])

            forecastD.append(forecastIcon)

            if (forecastConditions === "Clouds") {
                forecastIcon.attr("class", "fa-cloud ")
            }else if (forecastConditions === "Clear") {
                forecastIcon.attr("class", "fas fas-sun")
            }else {
                forecastIcon.attr("class", "fas fa-cloud-rain")
            }

            
        }
    }).catch (err => {
        console.error(err);
    });
});



function renderCitiesEl() {
    citiesListEl.empty();
    
    for (var i = 0; i < citiesList.length; i++) {
      var city = citiesList[i];
      
      var li = $("<li>").text(city);
      li.attr("id","listEl");
      li.attr("data-city", city);
      li.attr("class", "list-group-item");
      citiesListEl.prepend(li);
    }

}   