import { cityRequest } from "./request.js";
import { renderSelectedCities } from "./render.js";

let searchCityInput = document.getElementById('cityInput');
let searchButton = document.getElementById('search-button');
let likeButton = document.getElementById('like-button');
let selectedCity = document.getElementById('selectedCity');
let savedCurrentCity = localStorage.getItem('currentCity');
let selectedCitiesArray = [];
let selectedCitiesJSON = localStorage.getItem('selectedCitiesArray');


document.addEventListener('DOMContentLoaded', () => {

    if (savedCurrentCity) {
        cityRequest(event, searchCityInput, savedCurrentCity);
    } else {
        savedCurrentCity = 'Moscow';
    };

    if (selectedCitiesJSON) {
        selectedCitiesArray = JSON.parse(selectedCitiesJSON);
    };

    renderSelectedCities(selectedCitiesArray, savedCurrentCity, deleteCity, selectedCitiesJSON, searchCityInput, cityRequest);
});


function addSelectedCity() {
    let isCityInArray = false;
    
        selectedCitiesArray.forEach(city => {
            if (city.name === selectedCity.textContent) {
                isCityInArray = true;
                alert('Город уже добавлен в избранное.');
            }
        });

        if (!isCityInArray) {
            if (selectedCitiesArray.length < 14) {
                savedCurrentCity = selectedCity.textContent; 
                selectedCitiesArray.push({ name: selectedCity.textContent});
                // renderSelectedCities();
                renderSelectedCities(selectedCitiesArray, savedCurrentCity, deleteCity, selectedCitiesJSON, searchCityInput, cityRequest);
                console.log(selectedCitiesArray);
            } else {
                alert('Достигнут лимит избранных городов');
            };
        };
};


function deleteCity() {
    let cityParagraph = this.parentNode.querySelector('p');
    let cityName = cityParagraph.textContent;
    const indexToDelete = selectedCitiesArray.findIndex(city => city.name === cityName);
    selectedCitiesArray.splice(indexToDelete, 1);
    savedCurrentCity = selectedCity.textContent; 
    renderSelectedCities(selectedCitiesArray, savedCurrentCity, deleteCity, selectedCitiesJSON, searchCityInput, cityRequest);
};


searchButton.addEventListener('click', function(event) {
    cityRequest(event, searchCityInput, searchCityInput.value);
});

likeButton.addEventListener('click', addSelectedCity);