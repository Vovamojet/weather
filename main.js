import { cityRequest } from "./request.js";

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

    renderSelectedCities();
});


function renderSelectedCities(){
    // Удаляем все элементы списков из DOM
    const selectedList = document.getElementById('selected-cities-list');
    selectedList.innerHTML = "";

    // Создаем и вставляем элементы списков заново
        selectedCitiesArray.forEach((city) => {
            const selectedCityItem = document.createElement('li');
            const cityParagraph = document.createElement('p');
            cityParagraph.textContent = city.name;

            cityParagraph.addEventListener('click', () => {
                cityRequest(event, searchCityInput, city.name);
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '✖';
            deleteButton.classList.add('delete-button')
            deleteButton.addEventListener('click', deleteCity);

            selectedCityItem.appendChild(deleteButton);
            selectedCityItem.appendChild(cityParagraph);
            selectedList.appendChild(selectedCityItem);
        });

        selectedCitiesJSON = JSON.stringify(selectedCitiesArray);
        localStorage.setItem('selectedCitiesArray', selectedCitiesJSON);
        localStorage.setItem('currentCity', savedCurrentCity); 

        localStorage.setItem('selectedCitiesArray', JSON.stringify(selectedCitiesArray));
        localStorage.setItem('currentCity', savedCurrentCity);

        searchCityInput.focus(); 

        console.log('render done');
};


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
                renderSelectedCities();
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
    renderSelectedCities();
};


searchButton.addEventListener('click', function(event) {
    cityRequest(event, searchCityInput, searchCityInput.value);
});

likeButton.addEventListener('click', addSelectedCity);