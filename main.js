const searchCityInput = document.getElementById('cityInput');
const searchButton = document.getElementById('search-button');
const likeButton = document.getElementById('like-button');
const temperatureText = document.getElementById('temper-text');
const feelsLikeText = document.getElementById('feels-like');
const tempTwelveText = document.getElementById('temp-twelve');
const tempTwelveFeelsText = document.getElementById('temp-twelve-feels');
const tempFifteenText = document.getElementById('temp-fifteen');
const tempFifteenFeelsText = document.getElementById('temp-fifteen-feels');
const tempEighteenText = document.getElementById('temp-eighteen');
const tempEighteenFeelsText = document.getElementById('temp-eighteen-feels');
const weatherIconTwelve = document.getElementById('icon-twelve');
const weatherIconFifteen = document.getElementById('icon-fifteen');
const weatherIconEighteen = document.getElementById('icon-eighteen');
const sunriseTime = document.getElementById('sunrise-time');
const sunsetTime = document.getElementById('sunset-time');
const selectedCity = document.getElementById('selectedCity');
const weatherIcon = document.getElementById('weather-icon');

let CurrentCity;
let savedCurrentCity = getCookie('currentCity');

let selectedCitiesArray = [];
let selectedCitiesJSON = localStorage.getItem('selectedCitiesArray');


//getCookie и setCookie нужно бахнуть в отдельный модуль
function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}


function setCookie(name, value, options = {}) {
  options = {
    path: '/',
    ...options
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}


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


function cityRequest (event, searchCityInput, cityName) {
  event.preventDefault();

  const serverUrl = 'https://api.openweathermap.org/data/2.5/weather';
  const serverUrlForecast = 'https://api.openweathermap.org/data/2.5/forecast';
  const apiKey = 'f660a2fb1e4bad108d6160b7f58c555f';
  const url = `${serverUrl}?q=${cityName}&appid=${apiKey}`;
  const urlForecast = `${serverUrlForecast}?q=${cityName}&appid=${apiKey}`;

  fetch(url)
    .then(response => {
      if (response.status === 404) {
        throw new Error('Город не найден');
      };
      if (response.status === 400) {
        throw new Error('Введите название города');
      };
      return response.json();
    })
    .then((data) => {
      const temp = Math.round(data.main.temp - 273.15);
      const city = data.name;
      const feelsTemp = Math.round(data.main.feels_like - 273.15);
      const sunriseUnixTime = new Date(data.sys.sunrise * 1000);
      const sunrise = sunriseUnixTime.getHours() + ':' + sunriseUnixTime.getMinutes();
      const sunsetUnixTime = new Date(data.sys.sunset * 1000);
      const sunset = sunsetUnixTime.getHours() + ':' + sunsetUnixTime.getMinutes();
      const weatherCode = data.weather[0].icon;

      setCookie('currentCity', cityName, {secure: true, 'max-age': 3600})

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
      const tempTwelve = Math.round(data.list[5].main.temp - 273.15);
      const tempTwelveFeels = Math.round(data.list[5].main.feels_like - 273.15);
      const weatherCodeTwelve = data.list[5].weather[0].icon;
      const tempFifteen = Math.round(data.list[14].main.temp - 273.15);
      const tempFifteenFeels = Math.round(data.list[14].main.feels_like - 273.15);
      const weatherCodeFifteen = data.list[14].weather[0].icon;
      const tempEighteen = Math.round(data.list[15].main.temp - 273.15);
      const tempEighteenFeels = Math.round(data.list[15].main.feels_like - 273.15);
      const weatherCodeEighteen = data.list[15].weather[0].icon;

      tempTwelveText.textContent = ('Temperature: ' + tempTwelve);
      tempTwelveFeelsText.textContent = ('Feels like: ' + tempTwelveFeels);
      weatherIconTwelve.src = `https://openweathermap.org/img/wn/${weatherCodeTwelve}@2x.png`;

      tempFifteenText.textContent = ('Temperature: ' + tempFifteen);
      tempFifteenFeelsText.textContent = ('Feels like: ' + tempFifteenFeels);
      weatherIconFifteen.src = `https://openweathermap.org/img/wn/${weatherCodeFifteen}@2x.png`;

      tempEighteenText.textContent = ('Temperature: ' + tempEighteen);
      tempEighteenFeelsText.textContent = ('Feels like: ' + tempEighteenFeels);
      weatherIconEighteen.src = `https://openweathermap.org/img/wn/${weatherCodeEighteen}@2x.png`;
    });

  searchCityInput.value = '';
  // cityInput.value = ''; странно, но так тоже работает (cityInput не инициализирована)

  searchCityInput.focus();
};

function renderSelectedCities(){
    // Удаляем все элементы списков из DOM
    const selectedList = document.getElementById('selected-cities-list');
    selectedList.innerHTML = "";

    localStorage.clear(); //чистим localStorage

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

        //создаём JSON из массива городов
        selectedCitiesJSON = JSON.stringify(selectedCitiesArray);
        //сохраняем JSON в память
        localStorage.setItem('selectedCitiesArray', selectedCitiesJSON);

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