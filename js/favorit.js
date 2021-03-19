// Проверка объекта на пустоту
function isEmpty(obj) {
  for (let key in obj) {
    // если тело цикла начнет выполняться - значит в объекте есть свойства
    return false;
  }
  return true;
}

const $favoritMenu = document.querySelector(".favorit-menu");
if (localStorage.getItem('favorites') !== null) {
  $favoritMenu.classList.add('heart-red');
  $favoritMenu.classList.remove('heart-white');
}
else {
  $favoritMenu.classList.add('heart-white');
  $favoritMenu.classList.remove('heart-red');
}

let $domFavorites = document.querySelectorAll(".favorit");

if ($domFavorites.length) { // Ищем на странице class="favorit"

  if (localStorage.getItem('favorites') !== null) {  // Проверяем в localStorage наличие ключа favorites
    let savedFavorites = JSON.parse(localStorage.getItem('favorites')); // Загружаем JSON из localStorage
    let savedFavoritesId = []; // Создаем массив Id из сохраненых в localStorage
    for (let i in savedFavorites) {
      savedFavoritesId.push(savedFavorites[i].id); // Дописываем в массив Id
    }

    for (let i = 0; i < $domFavorites.length; i++) { // Перебираем найденые в Dom class="favorit"
      let $idFavorites = $domFavorites[i].dataset['id']; // Получаем Id у class="favorit"

      console.log('$idFavorites 1=>',$idFavorites);

      if (savedFavoritesId.includes($idFavorites)) { // Ищем совпадение Id в массиве savedFavoritesId
        $domFavorites[i].classList.add('heart-red'); // Ставвим красное сердце в Меню
        $domFavorites[i].classList.remove('heart-white');  // Удаляем белое сердце в Меню
      }

    }

  }
//================
  const data = {}; // Создаем объект

  for (let i = 0; i < $domFavorites.length; i++) { 
      $domFavorites[i].addEventListener('click', event => {
      if (event.target.classList.contains('heart-white')) { // Если не добавлено в избранное
        event.target.classList.add('heart-red');
        event.target.classList.remove('heart-white');
        $favoritMenu.classList.add('heart-red');
        $favoritMenu.classList.remove('heart-white');
        let $favId = event.target.dataset['id']; // Получаем Id у class="favorit"
        let properties = { // Cоздаем объект 
            id: $favId, // Id  и пишим в объект
            title: event.target.dataset['title'], // Получаем title у class="favorit" и пишим в объект
            img: event.target.dataset['img'], // Получаем img у class="favorit" и пишим в объект 
            cost: event.target.dataset['cost'] // Получаем cost у class="favorit" и пишим в объект
        }; 

            data[$favId] = properties; // Добавляем созданый объект в главный объект

        if (localStorage.getItem('favorites') !== null) { // Если в localStorage есть ключ favorites
            let favorites = JSON.parse(localStorage.getItem('favorites')); // Получаем значение favorites
            favorites[$favId] = properties; // Дописываем созданый объект к даным из localStorage
            localStorage.setItem('favorites', JSON.stringify(favorites)); // Сохраняем в localStorage
        }
        else {
          localStorage.setItem('favorites', JSON.stringify(data)); // Сохраняем в localStorage
        } 

      }
      else {
        event.target.classList.add('heart-white');
        event.target.classList.remove('heart-red');

        let $favId = event.target.dataset['id']; // Получаем Id у class="favorit"

        if (localStorage.getItem('favorites') !== null) { // Если в localStorage есть ключ favorites
            let favorites = JSON.parse(localStorage.getItem('favorites')); // Получаем значение favorites
            delete favorites[$favId]; // Удаляем из элемент из localStorage
            localStorage.setItem('favorites', JSON.stringify(favorites)); // Сохраняем в localStorage
        }
        if (isEmpty(JSON.parse(localStorage.getItem('favorites'))) !== false) { // Если в localStorage в favorites нет не одного свойства
          localStorage.removeItem('favorites'); // Удаляем ключ favorites в localStorage
          $favoritMenu.classList.add('heart-white'); // Ставвим белое сердце в Меню
          $favoritMenu.classList.remove('heart-red'); // Удаляем красное сердце в Меню
        }

      }
    });
  }
} 

