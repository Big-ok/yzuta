//Common js

svg4everybody();

$(document).ready(function () {
  /* Main menu fixed */
  (function () {
    var nav = document.querySelector('.js-header-menu');
    if (typeof nav !== 'undefined' && nav !== null) {
      function navFixed() {
        if (window.pageYOffset >= 150) {
          nav.classList.add('header-main--fixed');
        } else {
          nav.classList.remove('header-main--fixed');
        }
      }
      navFixed();
      window.addEventListener('scroll', navFixed);
    }
  })();
  /* !Main menu fixed */

  /* Brandbook menu fixes */
  (function () {
    var nav = document.querySelector('.js-brandbook-menu');
    if (typeof nav !== 'undefined' && nav !== null) {
      function navFixed() {
        if (window.pageYOffset >= 150) {
          nav.classList.add('brand-header--fixed');
        } else {
          nav.classList.remove('brand-header--fixed');
        }
      }
      navFixed();
      window.addEventListener('scroll', navFixed);
    }
  })();
  /* !Brandbook menu fixes */

  //Loader
  var loader = $('.js-loader'),
    mainTop = $('.js-main-top');

  var loaderRemove = function () {
    loader.animate({ opacity: 0 }, 1000, function () {
      $('body').removeClass('loading');
      loader.remove();
    });
    mainTop.addClass('active');
    mainTop.stick_in_parent({
      offset_top: 0,
      recalc_every: 1,
    });
  };

  if (loader.length > 0) {
    loader.addClass('in-progress');
    setTimeout(loaderRemove, 2000);
  }

  //Bg audio
  // var initBgPlayer = function(){

  //     var bgAudio = $('.js-music-wrap'),
  //         content = bgAudio.data('content'),
  //         bgAudioTog = bgAudio.find('.js-music-tog'),
  //         bgAudioTogTxt = bgAudio.find('.js-music-tog-txt');

  //     if(bgAudio.length > 0){
  //         var track = new Howl({
  //             src: content.track,
  //             autoUnlock: true,
  //             autoplay: false,
  //             preload: false,
  //             loop: true,
  //             volume: 0.5
  //         });

  //         bgAudioTog.on('click', function(e){
  //             e.preventDefault();

  //             if (track.playing()) {
  //                 bgAudioTogTxt.html(content.onAudio);
  //                 bgAudio.removeClass('state-playing').addClass('state-mute');
  //                 track.pause();
  //             } else {
  //                 track.load();
  //                 bgAudioTogTxt.html(content.offAudio);
  //                 bgAudio.addClass('state-playing').removeClass('state-mute');
  //                 track.play();
  //                 $.jPlayer.pause();
  //             }
  //         });

  //         track.on('load', function(){
  //             //bgAudio.removeClass('hidden');
  //             //track.play();
  //         });
  //     }
  // };

  // initBgPlayer();

  //Player
  //   var playerSelector = '.js-player-wrap';
  //   modulePlayer.initPlayer(playerSelector);

  //Test
  //   var testWrap = $('.js-test-wrap');
  //   if (testWrap.length > 0) {
  //     moduleTest.initTest(testWrap);
  //   }

  //Chronicle
  var chronicleOne = $('.js-chronicle-one-wrap');
  if (chronicleOne.length > 0) {
    moduleChronicle.initChronicle(chronicleOne);
  }

  //Photo Album
  var albumWrap = '.js-album-wrap';
  if (albumWrap.length > 0) {
    moduleAlbum.initAlbum(albumWrap);
  }

  //Letters
  //   var lettersWrap = '.js-letters-wrap';
  //   if (lettersWrap.length > 0) {
  //     moduleLetters.initLetters(lettersWrap);
  //   }

  //ParadeMap
  var paradeMap = $('.js-parade-map-wrap');
  if (paradeMap.length > 0) {
    moduleParadeMap.initParadeMap(paradeMap);
  }

  //Search toggle
  var searchTog = $('.js-search-tog');

  searchTog.on('click', function (e) {
    e.preventDefault();

    $('.js-header-search').toggleClass('active');
    $('.js-search-bg').toggleClass('active');
    $('.js-header-menu').toggleClass('header-main--search');
  });

  //Search toggle
  var socialTog = $('.js-social-tog');

  socialTog.on('click', function (e) {
    e.preventDefault();

    $(this).parents('.js-social-wrap').toggleClass('active');
  });

  //Init search
  var initSearch = function () {
    var searchWrap = $('.js-header-search'),
      searchWrapForm = searchWrap.find('.js-search-form'),
      searchWrapInput = searchWrap.find('.js-search-input'),
      searchWrapBtn = searchWrap.find('.js-search-submit');

    searchWrapInput.keyup(function () {
      if (searchWrapInput.val().trim()) {
        searchWrapBtn.removeClass('hidden');
      } else {
        searchWrapBtn.addClass('hidden');
      }
    });

    searchWrapForm.on('submit', function () {
      if (!searchWrapInput.val().trim()) {
        return false;
      }
    });
  };

  initSearch();

  //Menu mobile
  var menuTog = $('.js-menu-tog');

  menuTog.on('click', function (e) {
    e.preventDefault();
    $('.js-header-menu').toggleClass('active');
    menuTog.filter('.header-tog').toggleClass('active');

    var $outer = $('.js-header-menu.active'),
      $inner = $outer.find('.js-header-menu-inner');

    $inner.removeClass('has-overflow');

    setTimeout(function () {
      if (!$inner.length) return;
      if ($inner[0].offsetHeight < $inner[0].scrollHeight) {
        $inner.addClass('has-overflow');
      } else {
        $inner.removeClass('has-overflow');
      }
    }, 500);
  });

  (function () {
    var $block = $('.js-header-menu-inner'),
      $arrow = $block.find('.js-header-menu-arrow'),
      $arrowUp = $block.find('.js-header-menu-arrow-up');
    if (!$arrow.length) return;
    $block.on('scroll', function () {
      var position =
        $block[0].scrollHeight - $block[0].offsetHeight - $(this).scrollTop();
      if (position > 10) {
        $(this).addClass('has-overflow');
      } else {
        $(this).removeClass('has-overflow');
      }
      if (position < 10) {
        $(this).addClass('reached-bottom');
      } else {
        $(this).removeClass('reached-bottom');
      }
    });
    $arrow.on('click', function () {
      $block.animate(
        {
          scrollTop: $block[0].scrollHeight - $block[0].offsetHeight,
        },
        500
      );
    });
    $arrowUp.on('click', function () {
      $block.animate(
        {
          scrollTop: 0,
        },
        500
      );
    });
  })();

  //Menu brand mobile
  var menuBrandTog = $('.js-brand-menu-tog');

  menuBrandTog.on('click', function (e) {
    e.preventDefault();

    menuBrandTog.toggleClass('active');
    $('.js-brand-header-menu').toggleClass('active');
    $('.js-brandbook-menu').toggleClass('menu--open');
  });

  //Social grid
  //   var grid = $('.js-grid');
  //   if ($(window).width() > 480) {
  //     grid.masonry({
  //       itemSelector: '.js-grid-item',
  //     });

  //     grid.imagesLoaded().progress(function () {
  //       grid.masonry('layout');
  //     });
  //   }

  //Slider default
  var initSlider = function () {
    var sliderWrap = $('.js-slider-wrap');

    $.each(sliderWrap, function (index, value) {
      var sliderWrapElement = $(value).find('.js-slider-container'),
        sliderType = $(value).data('slider-type') || 'default',
        sliderCount = sliderWrapElement.find('.swiper-slide').length,
        $timeline = $(value).find('.js-custom-timeline'),
        sliderPagination = $(value).find('.js-slider-pagination'),
        sliderNav = sliderWrapElement.find('.js-slider-nav'),
        sliderPrev = $(value).find('.js-slider-prev'),
        sliderNext = $(value).find('.js-slider-next');

      if (sliderCount < 2) {
        sliderPagination.addClass('hidden');
        sliderPrev.addClass('hidden');
        sliderNext.addClass('hidden');
        return;
      }

      var sliderOptions = {
        autoHeight: $(value).data('slider-height') || false,
        loop: $(value).data('slider-loop') || false,
        slidesPerView: $(value).data('slide-count') || 'auto',
        spaceBetween: $(value).data('slide-space') || 0,
        centeredSlides: false,
        effect: $(value).data('slider-effect') || 'slide',
        autoplay: false,
        pagination: false,
        navigation: {
          nextEl: sliderNext,
          prevEl: sliderPrev,
        },
        breakpoints: {
          768: {
            slidesPerView: $(value).data('slide-count') || 'auto',
          },
        },
        on: {
          init: function () {
            if (sliderCount <= 1) {
              sliderPagination.addClass('hidden');
              sliderPrev.addClass('hidden');
              sliderNext.addClass('hidden');
            }
          },
        },
      };

      switch (sliderType) {
        case 'default':
          break;
        case 'heroic':
          sliderOptions.spaceBetween = 24;
          sliderOptions.breakpoints = {
            320: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 'auto',
            },
          };
          break;
        case 'steps':
        case 'event_list':
          if (sliderPagination.length > 0) {
            sliderOptions.pagination = {
              el: sliderPagination,
              threshold: 20,
              type: 'fraction',
              renderFraction: function (currentClass, totalClass) {
                return (
                  '<span class="slider-fraction__item ' +
                  currentClass +
                  '"></span>' +
                  '<span class="slider-fraction__item slider-fraction__item--divider">.</span>' +
                  '<span class="slider-fraction__item ' +
                  totalClass +
                  '"></span>'
                );
              },
              formatFractionCurrent: function (number) {
                return ('0' + number).slice(-2);
              },
              formatFractionTotal: function (number) {
                return ('0' + number).slice(-2);
              },
            };
          }
          break;
        case 'events':
          sliderOptions.spaceBetween = 32;
          sliderOptions.breakpoints = {
            320: {
              slidesPerView: 1,
              spaceBetween: 24,
            },
            768: {
              slidesPerView: 'auto',
            },
          };
          break;
        case 'event_one':
          if (sliderPagination.length > 0) {
            sliderOptions.pagination = {
              el: sliderPagination,
              type: 'fraction',
              renderFraction: function (currentClass, totalClass) {
                return (
                  '<span class="slider-fraction__item ' +
                  currentClass +
                  '"></span>' +
                  '<span class="slider-fraction__item slider-fraction__item--divider">/</span>' +
                  '<span class="slider-fraction__item ' +
                  totalClass +
                  '"></span>'
                );
              },
            };
          }
          break;
        case 'parade':
          sliderOptions.spaceBetween = 24;
          sliderOptions.centeredSlides = true;
          sliderOptions.slideToClickedSlide = true;
          sliderOptions.breakpoints = {
            300: {
              slidesPerView: 1,
            },
            1024: {
              slidesPerView: 2,
            },
            1280: {
              slidesPerView: 3,
              initialSlide: 1,
            },
          };
          break;
        default:
          break;
      }

      new Swiper(sliderWrapElement[0], sliderOptions);

      if ($timeline.length > 0) {
        var timelineParent = $timeline.parents('.js-slider-wrap'),
          sliderInstance = timelineParent.find('.js-slider-container')[0]
            .swiper,
          $timelineBar = $timeline.find('.js-custom-timeline--bar'),
          $points = $timeline.find('.js-custom-timeline--point'),
          $slides = sliderWrapElement.find('.swiper-slide'),
          maxOffset = $slides.length - 1,
          stepPercent = 100 / maxOffset,
          currentOffset = window.matchMedia('(max-width: 1199px)').matches
            ? 0
            : 1,
          pointsObj = Object.create(null);

        $points.each(function (index, point) {
          var $point = $(point),
            pointOffset = $slides
              .filter('[data-step="' + $point.attr('data-slide-year') + '"]')
              .index();
          if (index === 0) {
            $point.css('left', '0');
          } else if (index === $points.length - 1) {
            $point.css('left', '100%');
          } else {
            $point.css('left', pointOffset * stepPercent + '%');
          }
          $point.on('click', function () {
            sliderInstance.slideTo(pointOffset);
          });
          $point.attr('data-offset', pointOffset);
          pointsObj[pointOffset] = $point;
        });

        sliderInstance.on('slideChangeTransitionStart', function () {
          currentOffset = sliderInstance.activeIndex;
        });

        sliderInstance.on('slideChangeTransitionStart', function () {
          moveBar(currentOffset);
          updatePoints();
        });

        function updatePoints() {
          var $newActive = pointsObj[sliderInstance.activeIndex];
          $points.removeClass('active');
          if (currentOffset == maxOffset) {
            $points.last().addClass('active');
          } else if ($newActive) {
            $newActive.addClass('active');
          } else {
            for (var i = currentOffset; i >= 0; i--) {
              if (pointsObj[i]) {
                pointsObj[i].addClass('active');
                break;
              }
            }
          }
        }

        function moveBar(offset) {
          var ratio = (offset * stepPercent) / 100,
            template =
              '-ms-transform: translate3d(0px, 0px, 0px) scaleX({{length}}) scaleY(1); ' +
              '-webkit-transform: translate3d(0px, 0px, 0px) scaleX({{length}}) scaleY(1); ' +
              'transform: translate3d(0px, 0px, 0px) scaleX({{length}}) scaleY(1)'
                .split('{{length}}')
                .join(ratio.toString());
          $timelineBar.attr('style', template);
        }

        moveBar(currentOffset);
        updatePoints();
      }
    });
  };

  initSlider();

  //Parade countdown
  // var paradeCountdown = $('.js-countdown'),
  //     paradeDate = new Date(2020,5-1,9);
  //
  // paradeCountdown.countdown({
  //     until: paradeDate,
  //     padZeroes: true,
  //     regionalOptions: "ru"
  // });

  //Sticky elements
  // (function () {
  //   var sticky = $('.js-sticky'),
  //     stickyParent = sticky.data('sticky-parent') || false,
  //     stickyTop = sticky.data('sticky-top') || 0,
  //     isInitialized = false;

  //   init();

  //   moduleResize.width({
  //     userFunction: init,
  //   });

  //   function init() {
  //     if (isInitialized) return;
  //     if ($(window).width() > 768) {
  //       sticky.stick_in_parent({
  //         offset_top: stickyTop,
  //       });
  //       isInitialized = true;
  //     }
  //   }
  // })();

  //Social
  var shareWidgetWrap = $('.js-share-wrap');
  if (shareWidgetWrap.length > 0) {
    moduleShare.initShareWidget(shareWidgetWrap);
  }

  //Scrollspy
  if ($('.js-scroll-spy').length > 0) {
    var spy = new Gumshoe('.js-scroll-spy a', {
      offset: 100,
    });
  }

  //Smooth scroll
  $('.js-scroll-to').on('click', function (e) {
    e.preventDefault();
    var selector = $(this).attr('href'),
      type = $(this).data('type') || 'default',
      $el = $(selector);

    if (!$el.length) return;

    if (type === 'brand') {
      if ($(window).width() < 767) {
        $('.brand-header__btn--menu').trigger('click');
      }
    }

    var position = $el.offset().top;
    $('html, body').animate(
      {
        scrollTop: position - 100,
      },
      1500
    );
  });

  //Popup gallery
  // $(document).on('click', '.js-gallery', function (e) {
  //   e.preventDefault();

  //   var src = $(this).attr('href');

  //   $.fancybox.open({
  //     src: src,
  //     type: 'ajax',
  //     opts: {
  //       baseClass: 'popup-gallery-base',
  //       slideClass: 'popup-gallery',
  //       height: '100%',
  //       width: '100%',
  //       idleTime: false,
  //       baseTpl:
  //         '<div class="fancybox-container" role="dialog" tabindex="-1">' +
  //         '<div class="fancybox-bg"></div>' +
  //         '<div class="fancybox-inner">' +
  //         '<div class="fancybox-toolbar">' +
  //         '<div class="popup-gallery__top">' +
  //         '<span class="popup-gallery__top-h js-gallery-name"></span>' +
  //         '<span class="popup-gallery__top-count js-gallery-count"></span>' +
  //         '</div>' +
  //         '{{buttons}}' +
  //         '</div>' +
  //         '<div class="fancybox-stage"></div>' +
  //         '</div>' +
  //         '</div>',
  //       touch: false,
  //       autoFocus: false,
  //       buttons: ['close'],
  //       smallBtn: false,
  //       afterLoad: function (instance, slide) {
  //         var infobar = instance.$refs.toolbar[0],
  //           //infobarTitle = $(infobar).find('.js-gallery-name'),
  //           //infobarCount = $(infobar).find('.js-gallery-count'),
  //           infobarTitle = $('.js-gallery-name'),
  //           infobarCount = $('.js-gallery-count'),
  //           popupWrap = instance.$refs.container[0],
  //           popupGallery = $(popupWrap).find('.popup-gallery__inner'),
  //           popupGalleryName = popupGallery.data('gallery-name'),
  //           popupGalleryCount = popupGallery.data('gallery-count');

  //         infobarTitle.append(popupGalleryName);
  //         infobarCount.append(popupGalleryCount);

  //         iniSliderGallery();
  //       },
  //     },
  //   });
  // });

  //Slider default
  var iniSliderGallery = function () {
    var sliderWrap = $('.js-slider-gallery'),
      sliderPrev = sliderWrap.find('.js-slider-gallery-prev'),
      sliderNext = sliderWrap.find('.js-slider-gallery-next'),
      sliderWrapElement = sliderWrap.find('.js-slider-container'),
      sliderOptions = {
        autoHeight: false,
        //loop: true,
        loop: false,
        loopAdditionalSlides: 2,
        centeredSlides: true,
        speed: 1000,
        slidesPerView: 1.4,
        spaceBetween: 0,
        autoplay: false,
        pagination: false,
        threshold: 20,
        navigation: {
          nextEl: sliderNext,
          prevEl: sliderPrev,
        },
        breakpoints: {
          769: {
            spaceBetween: 32,
          },
          480: {
            spaceBetween: 15,
          },
        },
        on: {
          init: function () {
            var swiper = this;

            sliderWrap.on('click', '.swiper-slide', function () {
              var index = $(this).index();
              if (swiper.activeIndex === index + 1) {
                swiper.slidePrev();
              } else if (swiper.activeIndex === index - 1) {
                swiper.slideNext();
              }
            });

            sliderPrev.addClass('hidden');
          },
          reachBeginning: function () {
            sliderPrev.addClass('hidden');
          },
          reachEnd: function () {
            sliderNext.addClass('hidden');
          },
          fromEdge: function () {
            sliderPrev.removeClass('hidden');
            sliderNext.removeClass('hidden');
          },
        },
      };

    var swiper = new Swiper(sliderWrapElement[0], sliderOptions);
  };

  //Popup songs
  //   var songsPopup = $('.js-popup-songs');
  //   songsPopup.on('click', function (e) {
  //     e.preventDefault();

  //     var src = $(this).attr('href');

  //     $.fancybox.open({
  //       src: src,
  //       type: 'ajax',
  //       opts: {
  //         slideClass: 'popup-songs',
  //         baseClass: '',
  //         height: '100%',
  //         width: '100%',
  //         idleTime: false,
  //         touch: false,
  //         autoFocus: false,
  //         buttons: [],
  //         smallBtn: false,
  //         afterLoad: function (instance, slide) {
  //           var playerSelector = $(slide.$slide).find('.js-player-wrap');
  //           modulePlayer.initPlayer(playerSelector);
  //         },
  //       },
  //     });
  //   });

  //Video frame
  var videoPlay = $('.js-video-frame-play'),
    videoList = $('.js-video-frame');

  lazyframe(videoList, {
    src: videoList.data('src'),
    lazyload: false,
    initinview: false,
    onAppend: function (iframe) {
      var currentVideoUrl = $(iframe).attr('src');

      $(iframe).attr('src', currentVideoUrl + '?autoplay=1');
    },
  });

  //Map
  // var mapContainer = $('.js-map');

  // if (mapContainer.length) {
  //   ymaps.ready(init);
  //   function init() {
  //     var myMap = new ymaps.Map('map-contacts', {
  //       center: [55.764598, 37.612788],
  //       controls: [],
  //       zoom: 15,
  //     });

  //     var placemark = new ymaps.Placemark(
  //       [55.764598, 37.612788],
  //       {
  //         balloonContent: '',
  //         iconContent: '',
  //       },
  //       {
  //         iconLayout: 'default#image',
  //         iconImageHref: '/i/ico-map.png',
  //         iconImageSize: [32, 42],
  //         iconImageOffset: [-16, -42],
  //       }
  //     );

  //     myMap.geoObjects.add(placemark);
  //   }
  // }

  /* Nav centering mobile */
  (function () {
    var $wrapper = $('.nav-inner'),
      $items = $wrapper.find('.nav-inner__item'),
      $active = $items.filter('.active');
    if (!$items.length || !$active.length) return;
    var distance =
      $items
        .toArray()
        .slice(0, $active.index())
        .reduce(function (total, item) {
          return (total += $(item).outerWidth());
        }, 0) +
      $active.outerWidth() / 2;
    $wrapper.scrollLeft(distance * (distance / $wrapper.width()));
  })();
  /* !Nav centering mobile */

  $('.js-vmf-show').click(function () {
    $.magnificPopup.open({
      items: {
        src: $('.js-vmf-iframe').html(),
        type: 'inline',
      },
      showCloseBtn: false,
      closeBtnInside: false,
      callbacks: {
        open: function () {},
      },
      fixedContentPos: false,
    });
    return false;
  });
});
