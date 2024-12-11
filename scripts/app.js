import { APIKEY } from './environment.js'; 

//assigned values are for testing purposes only
let latitude ;
let longitude;
let locationName = "Stockton,CA,US";

// function getCoordinatesByLocationName(locationName){
//     return fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${locationName}&limit=5&appid=${APIKEY}`)
//     .then((response) => {
//         return response.json();
//     })
//     .then((data) => {
//         // console.log(`COORDINATES`+JSON.stringify(data));
//     //    latitude= data[0].lat;
//         // longitude = data[0].lon;   
//         // console.log("LAT" +latitude)
//         return (data);
//     })
// }

async function getCoordinatesByLocationName(locationName){
    const promise = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${locationName}&limit=5&appid=${APIKEY}`);
    const data= await promise.json(); // transforms it to a json format
    console.log(`DATA get coordinates` +JSON.stringify(data));
    getCurrentWeatherData(data);
    get5DayForecastData(data);
    return data;
  }

  async function getCurrentWeatherData(coordinatesData){
    // console.log(coordinatesData[0].lat);
   const promise = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinatesData[0].lat}&lon=${coordinatesData[0].lon}&appid=${APIKEY}`);
   const data= await promise.json(); // transforms it to a json format
   console.log(`CURRENT DATA`+ JSON.stringify(data));
   return data;
 }

 async function get5DayForecastData(coordinatesData){
    // console.log(coordinatesData[0].lat);
   const promise = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${coordinatesData[0].lat}&lon=${coordinatesData[0].lon}&appid=${APIKEY}`);
   const data= await promise.json(); // transforms it to a json format
   console.log(`forecast DATA`+ JSON.stringify(data));
   return data;
 }
 
getCoordinatesByLocationName(locationName);
