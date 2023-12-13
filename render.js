export function renderSelectedCities(selectedCitiesArray, savedCurrentCity, deleteCity, selectedCitiesJSON, searchCityInput, cityRequest) {
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

    localStorage.setItem('selectedCitiesArray', JSON.stringify(selectedCitiesArray));
    localStorage.setItem('currentCity', savedCurrentCity);

    searchCityInput.focus(); 

    console.log('render done');
}
