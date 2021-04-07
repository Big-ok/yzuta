/* gallery  */
new Swiper('.gallery', {
  dynamicBullets: true,
  // spaceBetween: 10, // Количество видимых слайдов
  // Эффект прозрачности
  effect: 'fade',
  fadeEffect: {
    crossFade: true,
  },
  //===
  // Эффект куба
  //   effect: 'cube',
  //   cubeEffect: {
  //     slideShadows: true,
  //     shadow: true,
  //     shadowOffset: 20,
  //     shadowScale: 0.94,
  //   },
  // ===
  // Эффект потока
  //   effect: 'fcoverflow',
  //   coverflowEffect: {
  //     rotate: 30,
  //     slideShadows: false,
  //   },
  // ===
  // Responsive breakpoints
  // breakpoints: {
  //     // when window width is >= 320px
  //     320: {
  //       slidesPerView: 2,
  //       spaceBetween: 20
  //     },
  //     // when window width is >= 480px
  //     480: {
  //       slidesPerView: 3,
  //       spaceBetween: 30
  //     },
  //     // when window width is >= 640px
  //     640: {
  //       slidesPerView: 4,
  //       spaceBetween: 40
  //     }
  //   }
  // ===
  // Lazy loading
  preloadImages: false, // Отключаем загрузку всех картинок
  // Enable lazy loading
  lazy: true,
  //   lazy: {
  //     loadOnTransitionStart: false, // Начинает работать когда переключаем слайды
  //     loadPrevNext: false, // Подгружает предыдущий и следующий слайд
  //   },
  watchSlidesProgress: false, // Слежка за видимыми слайдерами
  watchSlidesVisibility: false, // Добавление класса видимым слайдерам
  //===

  navigation: {
    nextEl: '.slider-arrow--next',
    prevEl: '.slider-arrow--prev',
  },
  loop: true,
  //   freeMode: true, // Свободный режим
  // loopedSlides: 4,
  autoplay: {
    delay: 5000,
    disableOnInteraction: true, // Останавливает при взаимодействии с слайдером
  },
  pagination: {
    el: '.blog-slider__pagination',
    clickable: true,
  },
  //===
  simulateTouch: false, // Блокируем перетаскивание
  // touchRatio: 0.4,
  //   grabCursor: true,
  //===
  //   slideToClickedSlide: true, // Листаем кликом
  // Добавляет хеши в url
  hashNavigation: {
    watchState: true,
  },
  // ===
  // Включает колесо мыши
  mousewheel: {
    invert: false,
  },
  thumbs: {
    swiper: {
      el: '.gallery-thumbs',
      slidesPerView: 6,
      spaceBetween: 2,
      touchRatio: 2,
      //
      // loop: true, //
      // loopAdditionalSlides: 10,
      // speed: 1000,
      // // spaceBetween: 3,

      // centeredSlides: true, //
      // slideToClickedSlide: true, //
    },
  },
  keyboard: {
    enabled: true,
    onlyInViewport: false,
  },
  watchOverflow: true, // Уберает элементы навигации если слайдов только 1
});
