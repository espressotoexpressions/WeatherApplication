import { APIKEY } from './environment.js'; 
import {saveToFavorites,getFavorites,removeFromFavorites,saveToPrevious,getPrevious} from "./localStorage.js";

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
let currentIcon = document.getElementById("currentIcon");
let favoritesLink=document.getElementById("favoritesLink");
let favoritesDropDownList=document.getElementById("favoritesDropDownList");
let previousDropDownList = document.getElementById("previousDropDownList");


async function getCoordinatesByLocationName(locationName){
    const promise = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${locationName}&limit=5&appid=${APIKEY}`);
    const data= await promise.json(); // transforms it to a json format
    console.log(`DATA get coordinates` +JSON.stringify(data));

    
    if (data.length>0)
        {
            let cityName =`${data[0].name}, ${data[0].state}, ${ data[0].country}`;
            currentCityName.innerText=cityName;
            getCurrentWeatherData(data);
            get5DayForecastData(data);
            
        }
        else {
            alert("No city found.");
        }
  
  }

async function getCurrentWeatherData(coordinatesData){
const promise = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinatesData[0].lat}&lon=${coordinatesData[0].lon}&appid=${APIKEY}&units=imperial`); //for Farenheit units
const data= await promise.json(); // transforms it to a json format

//icon
let iconCode = data.weather[0].icon; // accesss first weather condition as it is the primary if multiple weather condition is returned
console.log(iconCode+ "ICONCODE for current");

currentIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
console.log(currentIcon.src);
// Access the Unix timestamp from the 'dt' field
const timestamp = data.dt;

// Convert the timestamp to a JavaScript Date object
const date = new Date(timestamp * 1000); // Multiply by 1000 to convert from seconds to milliseconds

// Display the formatted date
currentDate.innerText=date.toLocaleString(); // Output: A human-readable date

currentTemp.innerText=data.weather[0].description;

   currentWeather.innerText=`${data.main.temp}°F`;
   currentMax.innerText=`${data.main.temp_max}°F`;
   currentMin.innerText=`${data.main.temp_min}°F`;

   console.log("CURR WEATHER"+JSON.stringify(data.weather[0].description));
   console.log(`CURRENT DATA`+ JSON.stringify(data));

 }

 async function get5DayForecastData(coordinatesData){
  
   const promise = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${coordinatesData[0].lat}&lon=${coordinatesData[0].lon}&appid=${APIKEY}&units=imperial`);
   const data= await promise.json(); // transforms it to a json format
   console.log(`forecast DATA`+ JSON.stringify(data));

   //forecast data population in UI
   for (let i=0; i<5;i++)// because we only want the top 5 entries of the returned json data
    {

        let varDayName =   `forecast${i}Day`;
        let iconName = `forecast${i}Icon`;
        let forecastWeatherName =   `forecast${i}weather`;
        let forecastMaxName = `forecast${i}max`;
        let forecastMinName = `forecast${i}min`; 
        
        let forecastDayElement = document.getElementById(varDayName.toString());
        let forecastIconElement = document.getElementById(iconName.toString());
        let forecastWeatherElement = document.getElementById(forecastWeatherName.toString());
        let forecastMaxElement = document.getElementById(forecastMaxName.toString());
        let forecastMinElement = document.getElementById(forecastMinName.toString());
        console.log(varDayName+ iconName + forecastWeatherName + forecastMaxName +forecastMinName);
        console.log("VARIABLE" + data.list[i].main.temp);
        forecastDayElement.innerText = data.list[i].dt_txt;
        
        //icon mapping from weather api
        let iconCode = data.list[i].weather[0].icon; // accesss first weather condition as it is the primary if multiple weather condition is returned
        console.log(iconCode+ "ICONCODE"+i);
        forecastIconElement.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        
        forecastWeatherElement.innerText =data.list[i].weather[0].description;
        forecastMaxElement.innerText=`${data.list[i].main.temp_max}°F`;
        forecastMinElement.innerText=`${data.list[i].main.temp_min}°F`;
    }

 }
 

//creates element on the fly to display on the favorites drop down list after clicking favorites link
favoritesLink.addEventListener('click', function(){

    favoritesDropDownList.innerHTML=""; //clears the html so that it will not create duplicates
    let favoritesArr= getFavorites();

    // caps the dropdown display items to max of 5
    let displayLength = favoritesArr.length;
    if (displayLength>5)
        {
            displayLength=5;
        }

   for (let i=0; i<displayLength ;i++) // displays items on the drop down list
        {
        //creates an element on the fly for each item on the list of favoritesArr
        const favoriteItem=document.createElement('h3');
        favoriteItem.innerText=favoritesArr[i];
        favoritesDropDownList.appendChild (favoriteItem);

        // Assign a unique ID for each element using city/location names
        // favoriteItem.id =favoritesArr[i];

        // let favoriteItemElement = document.getElementById(`${favoritesArr[i]}`);
        // console.log(favoriteItemElement+ "ITEM ELEMENT");

        //creates an event listener for each item in the list
        console.log(favoritesDropDownList);
        favoriteItem.addEventListener('click',function(){
            
            getCoordinatesByLocationName(favoritesArr[i]);
        
        });
        
        // if (favoritesArr.length>5)
        //     {
        //     const loadMoreItem=document.createElement('h3');
        //     loadMore.innerText=favoritesArr[i];
        //     favoritesDropDownList.appendChild (favoriteItem);
        //     }

    }
    //if favorites list is more than 5 have a link to load more
   
    if (favoritesArr.length==0) 
        {
            const errorItem=document.createElement('h3');
            errorItem.innerText="No favorite city added yet.";
            favoritesDropDownList.appendChild(errorItem);
        }
})


searchIcon.addEventListener('click',function(){

    let locationName = searchInput.value ;
    getCoordinatesByLocationName(locationName);
    searchInput.value=""; //clear out this field after displaying the current value
})


//show previous list when search Input field is clicked
searchInput.addEventListener('click',function(){
    previousDropDownList.innerHTML="";

    let previousArr= getPrevious();
    console.log("PREVIOUS" + previousArr);

    // caps the dropdown display items to max of 10
    let displayLength = previousArr.length;
    if (displayLength>10)
    {
        displayLength=10;
     }

     for (let i=0; i<displayLength ;i++) // displays items on the previous drop down list
        {
        //creates an element on the fly for each item on the list of favoritesArr
            const previousItem=document.createElement('li');
            previousItem.innerText=previousArr[i];
            previousDropDownList.appendChild (previousItem);


            console.log(previousDropDownList);
            previousItem.addEventListener('click',function(){
                
                getCoordinatesByLocationName(previousArr[i]);
            
            });
        
        // if (favoritesArr.length>5)
        //     {
        //     const loadMoreItem=document.createElement('h3');
        //     loadMore.innerText=favoritesArr[i];
        //     favoritesDropDownList.appendChild (favoriteItem);
        //     }

        }   
     

     if (displayLength==0) 
        {
            const errorItem=document.createElement('li');
            errorItem.innerText="No previous city searched yet.";
            favoritesDropDownList.appendChild(errorItem);
        }
});

