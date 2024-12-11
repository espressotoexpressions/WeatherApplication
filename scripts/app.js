import { APIKEY } from './environment.js'; 

//assigned values are for testing purposes only
// let latitude ;
// let longitude;

let searchInput = document.getElementById("searchInput");
let searchIcon = document.getElementById("searchIcon");
let currentDate = document.getElementById("currentDate");
let currentCityName = document.getElementById("currentCityName");
let currentWeather = document.getElementById("currentWeather");
let currentTemp = document.getElementById("currentTemp");
let currentMax= document.getElementById("currentMax");
let currentMin = document. getElementById("currentMin");




async function getCoordinatesByLocationName(locationName){
    const promise = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${locationName}&limit=5&appid=${APIKEY}`);
    const data= await promise.json(); // transforms it to a json format
    console.log(`DATA get coordinates` +JSON.stringify(data));
    let cityName =`${data[0].name}, ${data[0].state}, ${ data[0].country}`;
    currentCityName.innerText=cityName;
    getCurrentWeatherData(data);
    get5DayForecastData(data);
    return data;
  }

  async function getCurrentWeatherData(coordinatesData){
   const promise = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinatesData[0].lat}&lon=${coordinatesData[0].lon}&appid=${APIKEY}&units=imperial`); //for Farenheit units
   const data= await promise.json(); // transforms it to a json format

   // Access the Unix timestamp from the 'dt' field
const timestamp = data.dt;
// Convert the timestamp to a JavaScript Date object
const date = new Date(timestamp * 1000); // Multiply by 1000 to convert from seconds to milliseconds
// Display the formatted date
currentDate.innerText=date.toLocaleString(); // Output: A human-readable date

   currentTemp.innerText=data.weather[0].description;
//    let fTemp= (((data.main.temp) - 273.15) * 9/5 + 32).toFixed(2);// converts kelvin to farenheight

   currentWeather.innerText=`${data.main.temp} °F`;
   currentMax.innerText=`${data.main.temp_max}°F`;
   currentMin.innerText=`${data.main.temp_min}°F`;

   console.log("CURR WEATHER"+JSON.stringify(data.weather[0].description));
   console.log(`CURRENT DATA`+ JSON.stringify(data));

//    return data;
 }

 async function get5DayForecastData(coordinatesData){
  
   const promise = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${coordinatesData[0].lat}&lon=${coordinatesData[0].lon}&appid=${APIKEY}`);
   const data= await promise.json(); // transforms it to a json format
   console.log(`forecast DATA`+ JSON.stringify(data));
   return data;
 }
 


searchIcon.addEventListener('click',function(){
    let locationName = searchInput.value ;
    getCoordinatesByLocationName(locationName);
})