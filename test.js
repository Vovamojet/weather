//сохранить currentCity в куку city

document.cookie = "city=" + currentCity + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/";


// Функция для чтения cookie по имени
function getCookie(name) {
    
    let cookieName = name + "=";

    //создаем массив из строки cookie
    let cookies = document.cookie.split(';');

    //перебираем массив
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      //удалить все пробелы
    //   while (cookie.charAt(0) === ' ') {
    //     cookie = cookie.substring(1, cookie.length);
    //   }
      if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }
    return null;
  }
  
  // Получаем значение переменной currentCity из cookie
  let currentCityValue = getCookie("city");
  
  // Выводим значение в консоль
  console.log(currentCityValue);
  