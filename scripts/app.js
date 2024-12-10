import { APIKEY } from './environment.js'; 

//assigned values are for testing purposes only
let latitude = 44.34;
let longitude= 10.99;
let locationName = "Stockton,CA";

function getCoordinatesByLocationName(locationName){
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${locationName}&limit=5&appid=${APIKEY}`)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log(`COORDINATES`+JSON.stringify(data));
        return (data);
    })
}


function getCurrentWeatherData (latitude, longitude) {

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIKEY}`)
    .then((response) => {
        return response.json()
    })
    .then((data) => {
        console.log(`CURRENT`+JSON.stringify(data));
        return (data);
    })
}

 getCurrentWeatherData(latitude,longitude);

 function get5DayForecastData (latitude, longitude) {

    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${APIKEY}`)
    .then((response) => {
        return response.json()
    })
    .then((data) => {
        console.log(`5 day forecast`+JSON.stringify(data));
        return (data);
    })
}


get5DayForecastData(latitude,longitude);




