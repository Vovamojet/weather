let searchCityInput = document.getElementById('cityInput');
let searchButton = document.getElementById('search-button');
let likeButton = document.getElementById('like-button');
let temperatureText = document.getElementById('temper-text');
let feelsLikeText = document.getElementById('feels-like');
let tempTwelveText = document.getElementById('temp-twelve')
let tempTwelveFeelsText = document.getElementById('temp-twelve-feels')
let tempFifteenText = document.getElementById('temp-fifteen')
let tempFifteenFeelsText = document.getElementById('temp-fifteen-feels')
let tempEighteenText = document.getElementById('temp-eighteen')
let tempEighteenFeelsText = document.getElementById('temp-eighteen-feels')
let weatherIconTwelve = document.getElementById('icon-twelve');
let weatherIconFifteen = document.getElementById('icon-fifteen');
let weatherIconEighteen = document.getElementById('icon-eighteen');
let sunriseTime = document.getElementById('sunrise-time');
let sunsetTime = document.getElementById('sunset-time');
let selectedCity = document.getElementById('selectedCity');
let weatherIcon = document.getElementById('weather-icon');
let CurrentCity;

let selectedCitiesArray = JSON.parse(localStorage.getItem('savedSelectedCity'));
let savedCurrentCity = localStorage.getItem('currentCity');


document.addEventListener('DOMContentLoaded', () => {
    if (savedCurrentCity) {
        cityRequest(event, searchCityInput, savedCurrentCity);
    } else {
        savedCurrentCity = 'Moscow';
    };

    renderSelectedCities();
});


function cityRequest(event, searchCityInput, cityName) {
    event.preventDefault();

    const serverUrl = 'https://api.openweathermap.org/data/2.5/weather';
    const serverUrlForecast = 'https://api.openweathermap.org/data/2.5/forecast';
    const apiKey = 'f660a2fb1e4bad108d6160b7f58c555f'; 
    const url = `${serverUrl}?q=${cityName}&appid=${apiKey}`;
    const urlForecast = `${serverUrlForecast}?q=${cityName}&appid=${apiKey}`;


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
            // console.log(data);
            let temp = Math.round(data.main.temp - 273.15);
            let city = data.name;
            let feelsTemp = Math.round(data.main.feels_like - 273.15);
            let sunriseUnixTime = (new Date(data.sys.sunrise * 1000))
            let sunrise = sunriseUnixTime.getHours() + ':' + sunriseUnixTime.getMinutes();
            let sunsetUnixTime = (new Date(data.sys.sunset * 1000))
            let sunset = sunsetUnixTime.getHours() + ':' + sunsetUnixTime.getMinutes();
            const weatherCode = data.weather[0].icon;

            CurrentCity = cityName;
            localStorage.setItem('currentCity', cityName); //сохр в память текущий город
            // console.log(feelsTemp);
            temperatureText.textContent = (temp);
            feelsLikeText.textContent = ('Feels like: ' + feelsTemp);
            sunriseTime.textContent = ('Sunrise: ' + sunrise);
            sunsetTime.textContent = ('Sunset: ' + sunset);
            selectedCity.textContent = city;
            weatherIcon.src = `https://openweathermap.org/img/wn/${weatherCode}@2x.png`;
        })
        .catch(error => {
            console.error(error);
            alert(error);
        });


        fetch(urlForecast)
        .then(response => {
        return response.json()
        })
        .then((data) => {
            // console.log(data);
            let tempTwelve = Math.round(data.list[5].main.temp - 273.15);
            let tempTwelveFeels = Math.round(data.list[5].main.feels_like - 273.15);
            let weatherCodeTwelve = data.list[5].weather[0].icon;
            let tempFifteen = Math.round(data.list[14].main.temp - 273.15);
            let tempFifteenFeels = Math.round(data.list[14].main.feels_like - 273.15);
            let weatherCodeFifteen = data.list[14].weather[0].icon;
            let tempEighteen = Math.round(data.list[15].main.temp - 273.15);
            let tempEighteenFeels = Math.round(data.list[15].main.feels_like - 273.15);
            let weatherCodeEighteen = data.list[15].weather[0].icon;


            tempTwelveText.textContent = ('Temperature: ' + tempTwelve);
            tempTwelveFeelsText.textContent = ('Feels like: ' + tempTwelveFeels);
            weatherIconTwelve.src = `https://openweathermap.org/img/wn/${weatherCodeTwelve}@2x.png`;

            tempFifteenText.textContent = ('Temperature: ' + tempFifteen);
            tempFifteenFeelsText.textContent = ('Feels like: ' + tempFifteenFeels);
            weatherIconFifteen.src = `https://openweathermap.org/img/wn/${weatherCodeFifteen}@2x.png`;

            tempEighteenText.textContent = ('Temperature: ' + tempEighteen);
            tempEighteenFeelsText.textContent = ('Feels like: ' + tempEighteenFeels);
            weatherIconEighteen.src = `https://openweathermap.org/img/wn/${weatherCodeEighteen}@2x.png`;

        })

    searchCityInput.value='';
    // cityInput.value = ''; странно, но так тоже работает (cityInput не инициализирована)

    searchCityInput.focus(); //фокусируемся на инпуте
};

function renderSelectedCities(){
    // Удаляем все элементы списков из DOM
    const selectedList = document.getElementById('selected-cities-list');
    selectedList.innerHTML = "";
    localStorage.clear(); //чистим localStorage

    // Проверяем, что selectedCitiesArray не равен null
    if (selectedCitiesArray !== null) {
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

        localStorage.setItem('savedSelectedCity', JSON.stringify(selectedCitiesArray));
        savedCurrentCity = localStorage.getItem('currentCity');

        console.log('render done');
    }
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
        if (selectedCitiesArray.length < 14) {
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

    renderSelectedCities();
    console.log(selectedCitiesArray);
};


searchButton.addEventListener('click', function(event) {
    cityRequest(event, searchCityInput, searchCityInput.value);
});

likeButton.addEventListener('click', addSelectedCity);