const $favoritSend = document.querySelector('.favorit-send');
const $favoritesList =document.querySelector('.favorites-list');
if (localStorage.getItem('favorites') !== null) {  // Проверяем в localStorage наличие ключа favorites
   let savedFavorites = JSON.parse(localStorage.getItem('favorites')); // Загружаем JSON из localStorage
   if (Object.keys(savedFavorites).length != 0) {
      let i = 1;
      let out = '<ul>';
      for (let key in savedFavorites) {

         let img700 = savedFavorites[key]['img'].replace(/120/gi, '700');
         out += `
            <li>
               <div class="list__col">
                  <b class="red-text">${i++}</b>.
               </div>
               <div class="list__col">
                  <a class="image-popup-zoom" href="${img700}">
                        <img src="${savedFavorites[key]['img']}">
                  </a>
               </div>
               <div class="list__col">
                  <span>${savedFavorites[key]['title']}</span>
               </div>
               <div class="list__col">
                  <a href="" class="btn-icons"><span class="icon-delete delete" data-id="${key}"></span></a>
                  <a href="index.php?id=${key}" class="btn-icons"><span class="icon-view popup-show"></span></a>
               </div>
            </li>`;
      }
      out += `</ul>`;
      $favoritesList.innerHTML = out;

      $favoritesList.addEventListener('click', (event) => {
         
         let target = event.target;
         if (target.classList.contains('delete')) {
            event.preventDefault();
            target.parentElement.parentElement.parentElement.remove();
            let $favId = event.target.dataset['id'];
            delete savedFavorites[$favId];

            if (Object.keys(savedFavorites).length >= 1) {
               localStorage.setItem('favorites', JSON.stringify(savedFavorites)); // Сохраняем в localStorage
            } else {
               localStorage.removeItem('favorites');
               if ($favoritSend && $favoritesList) {
                  $favoritSend.style.display ='none';
                  $favoritesList.innerHTML = document.querySelector('.favorites-preview').innerHTML;
               }
               $favoritMenu.classList.add('heart-white');
               $favoritMenu.classList.remove('heart-red');
            }
         }
      });

      //=======================
      let sendFavorites = JSON.parse(localStorage.getItem('favorites'));  
      let j = 1;
      let send = '';
      for (let key in sendFavorites) {
      send += `${key}|${sendFavorites[key]['title']}|${sendFavorites[key]['cost']};`;
      }
      send = send.replace(/(\s+)?.$/, '');
      document.querySelector('#favorites').value = send;
      //=======================
   }
 } else {
   if ($favoritSend) {
      $favoritSend.style.display ='none';
   }
   $favoritesList.innerHTML = document.querySelector('.favorites-preview').innerHTML;
 }