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
   console.log(localStorage);
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

    console.log(weatherURL)

    fetch(weatherURL)
    .then(response => {
        return response.json();
    }).then (data => {
        console.log(data)
        var lat = (data.coord.lat)
        var long = (data.coord.lon)

        var today = moment();
        $("#currentWeather").attr("class", "card");
        $("#currentDay").text(city + ": " + today.format("MMM Do, YYYY"));
        $("#temp").text("Temp: " + data.main.temp + "°F");
        $("#wind").text("Wind: " + data.wind.speed + "MPH");
        $("#humidity").text("Humidity: " + data.main.humidity + " %");

    }).catch (err => {
        console.error(err);
    });

    fetch(forecastURL)
    .then(response => {
        return response.json();
    }).then (data => {
        console.log(data)
        console.log(data.list[0]["dt_txt"])
        for (i=0; i<5; i++) {
            $("#forecast").attr("class", "card");
            $("#forecastDay"+i).text(city + ": " + data.list[(i+1)*8]["dt_txt"]);
            $("#temp"+i).text("Temp: " + data.list[(i+1)*8].main.temp);
            $("#wind"+i).text("Wind: " + data.list[(i+1)*8].wind.speed);
            $("#humidity"+i).text("Humidity: " + data.list[(i+1)*8].main.humidity);
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
      console.log(li);
      citiesListEl.prepend(li);
    }

}   




// fetch(weatherURL)
//     .then(response => {
//         return response.json();
//     }).then (data => {
//         console.log(data)
//     }).catch (err => {
//         console.error(err);
//     });
