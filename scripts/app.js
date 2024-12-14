import { APIKEY } from './environment.js'; 
import {saveToFavorites,getFavorites,removeFromFavorites,saveToPrevious,getPrevious} from "./localStorage.js";


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
let addFavoriteIcon = document.getElementById("addFavoriteIcon");
let removeFavoriteIcon = document.getElementById("removeFavoriteIcon");

let favoriteSection =document.getElementById("favoriteSection");
let currentSection = document.getElementById("currentSection");
let forecastSection = document.getElementById("forecastSection");


let previousArr= getPrevious();
previousArr.reverse();

let favoritesArr= getFavorites();
favoritesArr.reverse();

async function getCoordinatesByLocationName(locationName){
    const promise = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${locationName}&limit=5&appid=${APIKEY}`);
    const data= await promise.json(); // transforms it to a json format
    
    if (data.length>0)
        {
       
            let cityName =`${data[0].name}`;
           
            //check if there is state
            if (("state" in data[0])) {
            
                cityName += `, ${data[0].state}`;
            }
            cityName += `, ${data[0].country}`;
            currentCityName.innerText=cityName;
            getCurrentWeatherData(data[0].lat, data[0].lon);
            get5DayForecastData(data[0].lat, data[0].lon);
            saveToPrevious(cityName);
            
        }
        else {
            alert("No city found. Please check if you have State indicated, if applicable.");
     
        }
  
  }
  async function getCityNameByCoordinates(latitude,longitude){
    const promise = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${APIKEY}`);
    const data= await promise.json(); // transforms it to a json format
    if (data.length>0)
        {
       
            let cityName =`${data[0].name}`;
           
            //check if there is state
            if (("state" in data[0])) {
            
                cityName += `, ${data[0].state}`;
            }
            cityName += `, ${data[0].country}`;
            currentCityName.innerText=cityName;
            getCurrentWeatherData(data[0].lat, data[0].lon);
            get5DayForecastData(data[0].lat, data[0].lon);
            saveToPrevious(cityName);
            
        }
        else {
            alert("No city found.");
     
        }
  }

async function getCurrentWeatherData(latitude,longitude){
const promise = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIKEY}&units=imperial`); //for Farenheit units
const data= await promise.json(); // transforms it to a json format

//icon
let iconCode = data.weather[0].icon; // accesss first weather condition as it is the primary if multiple weather condition is returned

currentIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

// Access the Unix timestamp from the 'dt' field
const timestamp = data.dt;

// Convert the timestamp to a JavaScript Date object
const date = new Date(timestamp * 1000); 

// Display the formatted date
currentDate.innerText=date.toLocaleString('en-US', {
    weekday: 'long', // e.g., "Monday"
    month: 'long',   // e.g., "December"
    day: 'numeric'   // e.g., "13"
}); 

currentTemp.innerText=data.weather[0].description;

   currentWeather.innerText=`${data.main.temp}°F`;
   currentMax.innerText=`High: ${data.main.temp_max}°F`;
   currentMin.innerText=`Low: ${data.main.temp_min}°F`;


   //update favorites icon 
   let favoritesArr= getFavorites();
   if (favoritesArr.includes(currentCityName.innerText))
    {
        addFavoriteIcon.classList.remove("active");
        addFavoriteIcon.classList.add("inactive");

        removeFavoriteIcon.classList.remove("inactive");
        removeFavoriteIcon.classList.add("active");
    }
    else{ //if it does not exist as favorite 
        removeFavoriteIcon.classList.remove("active");
        removeFavoriteIcon.classList.add("inactive");
    
        //add  add fav icon
        addFavoriteIcon.classList.remove("inactive");
        addFavoriteIcon.classList.add("active");
    }

 }

 async function get5DayForecastData(latitude,longitude){
  
   const promise = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${APIKEY}&units=imperial`);
   const data= await promise.json(); // transforms it to a json format
  
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
     
      
         const timestampforecast= data.list[i*8].dt; // multplied index to 8 to account for each day because there are 8 entries of 3 hr intervals each day
        // Convert the timestamp to a JavaScript Date object
        const date = new Date(timestampforecast * 1000); 

        // Display the formatted date to show Day only
        forecastDayElement.innerText=(date.toLocaleString('en-US', {
            weekday: 'short'
        })).toUpperCase(); 
                
      
;        //icon mapping from weather api
        let iconCode = data.list[i*8].weather[0].icon; // accesss first weather condition as it is the primary if multiple weather condition is returned
        forecastIconElement.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        forecastWeatherElement.innerText =data.list[i*8].weather[0].description;
        forecastMaxElement.innerText=`${data.list[i*8].main.temp_max}°F`;
        forecastMinElement.innerText=`${data.list[i*8].main.temp_min}°F`;
    }

 }
 

//creates element on the fly to display on the favorites drop down list after clicking favorites link
favoritesLink.addEventListener('click', function(){
    favoritesArr=getFavorites();
    favoritesArr.reverse();
    favoritesDropDownList.innerHTML=""; //clears the html so that it will not create duplicates
  
    // caps the dropdown display items to max of 5
    let displayLength = favoritesArr.length;

    //displays a label when no favorites is added yet
    if (displayLength==0) 
        {
            const errorItem=document.createElement('li');
            errorItem.innerText="No favorite city added yet.";
            favoritesDropDownList.appendChild(errorItem);
        }

    if (displayLength>5)
        {
            displayLength=5;
        }

   for (let i=0; i<displayLength ;i++) // displays items on the drop down list
        {
        //creates an element on the fly for each item on the list of favoritesArr
            const favoriteItem=document.createElement('li');
            favoriteItem.innerText=favoritesArr[i];
            favoritesDropDownList.appendChild (favoriteItem);


            //creates an event listener for each item in the list     
            favoriteItem.addEventListener('click',function(){
                getCoordinatesByLocationName(favoritesArr[i]);
            
            });       

        }
        // display load more link and add it on the list
        if (favoritesArr.length>5){
            const loadItem =document.createElement('li');
            loadItem.innerText="Load All Favorites";
            favoritesDropDownList.appendChild (loadItem);

            loadItem.addEventListener (`click`,function(){
                favoriteSection.classList.remove("inactive");
                currentSection.classList.add("inactive");
                forecastSection.classList.add("inactive");

                for (let j=0; j<favoritesArr.length ;j++) // displays items 
                {
                //creates an element on the fly for each item on the list of favoritesArr
                    const favoriteitemsSection =document.getElementById("favoriteitemsSection"); // the whole div for ul

                    const favoriteSectionItem=document.createElement('li'); // favorite item  create
                    favoriteSectionItem.classList.add("favCityItem");
                    
                    // Create a <span> for the text to separate it from the icon
                    const favoriteText = document.createElement('span');
                    favoriteText.innerText = `${[j+1]}. ${favoritesArr[j]}`;
                    favoriteSectionItem.appendChild(favoriteText); // Add the text to the <li>

                    
                    //create an <i> for the icon
                    const favoriteItemIcon = document.createElement('i');
                    favoriteItemIcon.classList.add("fa-solid", "fa-bookmark");
                    favoriteSectionItem.appendChild (favoriteItemIcon);
                    

                    const removeFavoriteItemIcon = document.createElement('i');
                    removeFavoriteItemIcon.classList.add("fa-regular", "fa-bookmark","inactive");
                  
                    favoriteSectionItem.appendChild (removeFavoriteItemIcon);
                    
                    // Append the <li> to the parent container
                    favoriteitemsSection.appendChild (favoriteSectionItem);

                    //creates an event listener for each item in the list     
                    favoriteText.addEventListener('click',function(){
                        console.log("ENTER EVENT"+favoritesArr[j]);
                        getCoordinatesByLocationName(favoritesArr[j]);
                        favoriteSection.classList.add("inactive");
                        currentSection.classList.remove("inactive");
                        forecastSection.classList.remove("inactive");
                    
                    });       

                    //create an event listener for every bookmark icon
                    favoriteItemIcon.addEventListener( `click`,function(){
                        removeFromFavorites(favoritesArr[j]);
                        console.log("ENTER remove");
                        favoriteItemIcon.classList.add("inactive");
                        removeFavoriteItemIcon.classList.remove("inactive");
                    
                    });

                 }

            });
        }

     



});

searchIcon.addEventListener('click',async function(){

    let locationName = searchInput.value ;
     getCoordinatesByLocationName(locationName);
    searchInput.value=""; //clear out this field after displaying the current value
})


//show previous list when search Input field is clicked
searchInput.addEventListener('click',function(){
    previousArr= getPrevious();
    previousArr.reverse();

    previousDropDownList.innerHTML="";


    let displayLength = previousArr.length;
    
    // caps the dropdown display items to max of 10
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
            previousItem.addEventListener('click',function(){
                getCoordinatesByLocationName(previousArr[i]);
            
            });
        
       

        }   
     

     if (displayLength==0) 
        {
         
            const errorItem=document.createElement('li');
            errorItem.innerText="No previous city searched yet.";
            previousDropDownList.appendChild(errorItem);
        }
});

addFavoriteIcon.addEventListener('click',function(){
    saveToFavorites(currentCityName.innerText);
    //hide add fav icon
    addFavoriteIcon.classList.remove("active");
    addFavoriteIcon.classList.add("inactive");

    //show remove icon
    removeFavoriteIcon.classList.remove("inactive");
    removeFavoriteIcon.classList.add("active");

  
});
removeFavoriteIcon.addEventListener(`click`,function(){
    removeFromFavorites(currentCityName.innerText)
    //hide remove icon
    removeFavoriteIcon.classList.remove("active");
    removeFavoriteIcon.classList.add("inactive");

    //add  add fav icon
    addFavoriteIcon.classList.remove("inactive");
    addFavoriteIcon.classList.add("active");

});


//get geolocation if localstorage does not exist upon page load else display last search
if (previousArr.length==0){ 
        navigator.geolocation.getCurrentPosition(
            success, 
            error 
        );
        //if user accepts geolocation 
        function success(position) {
            getCityNameByCoordinates(position.coords.latitude,position.coords.longitude);
        }

    //if user denied geo location load stockton by default
        function error(err) {
            console.error(`Error: ${err.message}`);
            getCoordinatesByLocationName("Stockton,CA,US");
        }
    }
//display last city search upon page load
else {
    getCoordinatesByLocationName(previousArr[0]);
    }





