let searchCityInput = document.getElementById('cityInput');
let searchButton = document.getElementById('search-button');
let likeButton = document.getElementById('like-button');
let temperatureText = document.getElementById('temper-text');
let selectedCity = document.getElementById('selectedCity');
let weatherIcon = document.getElementById('weather-icon');

const selectedCitiesArray = [];

//при открытии страницы установить фокус на input и сделать запрос по Москве
document.addEventListener('DOMContentLoaded', () => {
    searchCityInput.focus();
    cityRequest(event, searchCityInput, 'Moscow');
});


function cityRequest(event, searchCityInput, cityName) {
    event.preventDefault();

    const serverUrl = 'http://api.openweathermap.org/data/2.5/weather';
    const apiKey = 'f660a2fb1e4bad108d6160b7f58c555f'; 
    const url = `${serverUrl}?q=${cityName}&appid=${apiKey}`;


    fetch(url)
        .then(response => {
            if (response.status === 404) {
                throw new Error(`Город не найден`);
            };
            if (response.status === 400) {
                throw new Error(`Введите название города`);
            };
        return response.json()
        })
        .then((data) => {
            let temp = Math.round(data.main.temp - 273.15);
            let city = data.name;
            temperatureText.textContent = (temp + '°');
            selectedCity.textContent = city;
            const weatherCode = data.weather[0].icon;
            weatherIcon.src = `https://openweathermap.org/img/wn/${weatherCode}@4x.png`;
        })
        .catch(error => {
            console.error(error);
            alert(error);
        });

    searchCityInput.value='';
    // cityInput.value = ''; странно, но так тоже работает (cityInput не инициализирована)
};

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
    
            selectedCityItem.appendChild(cityParagraph);
            selectedCityItem.appendChild(deleteButton);
            selectedList.appendChild(selectedCityItem);
        });
    
        console.log('render done');
};



function addSelectedCity() {
    let isCityInArray = false;
    
    // Есть ли город в массиве
    selectedCitiesArray.forEach(city => {
        if (city.name === selectedCity.textContent) {
            isCityInArray = true;
            alert('Город уже добавлен в избранное.');
        }
    });

    // Если город не добавлен и не превышен лимит
    if (!isCityInArray) {
        if (selectedCitiesArray.length < 6) {
            selectedCitiesArray.push({ name: selectedCity.textContent });
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

    renderSelectedCities();
    console.log(selectedCitiesArray);
};

searchButton.addEventListener('click', function(event) {
    cityRequest(event, searchCityInput, searchCityInput.value);
});

likeButton.addEventListener('click', addSelectedCity);