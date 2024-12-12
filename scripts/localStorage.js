function saveToFavorites(cityName) {
    //get the current values that are saved into local storage
  
    let cityArr = getFavorites();

    //add new name into our cityArr array
    if (!cityArr.includes(cityName)) {
        cityArr.push(cityName);
    }
    

    //save updated array to local storage
    //JSON.stringify: Converts the array (or object) into a JSON string that can be stored in local storage.
    localStorage.setItem('CityNames', JSON.stringify(cityArr));

}


function getFavorites(){
    // get all of the values that are stored in cityArr in local storage
    let favoritesData = localStorage.getItem('CityNames');
    // console.log("FAVORITES DATA" +JSON.stringify(favoritesData));

    if (favoritesData == null) {
        return [];
    }
    //JSON.parse: Converts the JSON string back into an array (or object) so you can work with it.
    return JSON.parse(favoritesData);
}

function removeFromFavorites(cityName){
    let cityArr = getFavorites();

    // find the index of the name in local storage

    let cityIndex = cityArr.indexOf(cityName);

    //remove the name from the array using the splice method.
    //Start at the index of name and remove 1 item
    cityArr.splice(cityIndex, 1);

    // save updated array to local storage
    localStorage.setItem('CityNames', JSON.stringify(cityArr));
}




export{saveToFavorites, getFavorites,removeFromFavorites}