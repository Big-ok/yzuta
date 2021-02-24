//Letters module
var moduleLetters = (function() {
    'use strict';

    var initLetters = function(lettersWrap) {
        var letters = $(lettersWrap),
            lettersFilter = letters.find('.js-letters-filter'),
            filterEvents = lettersFilter.filter('[data-type="events"]'),
            filterTags = lettersFilter.filter('[data-type="tags"]'),
            filterYear = lettersFilter.filter('[data-type="year"]'),
            lettersClear = letters.find('.js-letters-filter-clear'),
            lettersSlider = letters.find('.js-letters-slider'),
            lettersSliderContainer = lettersSlider.find('.swiper-container'),
            lettersSliderNav = letters.find('.js-letters-slider-nav'),
            lettersSliderPrev = lettersSliderNav.find('.js-letters-slider-prev'),
            lettersSliderNext = lettersSliderNav.find('.js-letters-slider-next'),
            lettersSliderPagination = lettersSliderNav.find('.js-letters-slider-pagination'),
            lettersSliderFill = lettersSliderNav.find('.js-letters-slider-fill'),
            lettersBegin = letters.find('.js-letters-slider-begin'),
            lettersForm = $('#letters-form'),
            allSlides = ''
        ;

        if (lettersFilter.length) {
            $.each(lettersFilter, function(index, val) {
                var filterItem = $(val);

                initSelect(filterItem);

                filterItem.on('select2:select', function() {
                    if (filterEvents.val() === '0' && filterTags.val() === '0' && filterYear.val() === '0') {
                        lettersClear.prop('disabled', true);
                    } else {
                        lettersClear.prop('disabled', false);
                    }
                    renderLettersList();
                });
            });

            lettersClear.on('click', function() {
                lettersFilter.val('0').trigger('change');
                lettersFilter.eq(0).trigger('select2:select');
            });
        }

        if (lettersSlider.length) {
            swiperLetters = new Swiper(lettersSliderContainer[0], {
                centeredSlides: true,
                watchOverflow: true,
                autoHeight: false,
                preloadImages: false,
                lazyLoading: true,
                lazy: {
                    loadPrevNext: false,
                    loadPrevNextAmount: 3,
                    loadOnTransitionStart: true
                },
                watchSlidesVisibility: true,
                slidesPerView: 3,
                spaceBetween: 20,
                pagination: {
                    el: lettersSliderPagination,
                    type: 'fraction',
                    renderFraction: function(currentClass, totalClass) {
                        return '<span class="swiper-pagination-item ' + currentClass + '"></span>' +
                            '<span class="swiper-pagination-item swiper-pagination-item--divider">/</span>' +
                            '<span class="swiper-pagination-item ' + totalClass + '"></span>';
                    }
                },
                navigation: {
                    nextEl: lettersSliderNext,
                    prevEl: lettersSliderPrev
                },
                breakpoints: {
                    320: {
                        centeredSlides: true,
                        slidesPerView: 1.3
                    },
                    768: {
                        slidesPerView: 3
                    }
                },
                on: {
                    slideChange: () => {
                        if (swiperLetters.activeIndex === 0) {
                            lettersBegin.prop('disabled', true);
                        } else {
                            lettersBegin.prop('disabled', false);
                        }
                        renderFill(swiperLetters.activeIndex, swiperLetters.slides.length);
                    }
                }
            });

            lettersBegin.on('click', () => { swiperLetters.slideTo(0); });

            renderLettersList();
        }

        function initSelect(select) {
            select.select2({
                theme: 'photo-album',
                placeholder: select.data('placeholder'),
                dropdownParent: select.parent('.js-letters-filter-wrap'),
                minimumResultsForSearch: Infinity,
                width: '100%'
            });
        }

        function renderFill(cur, all) {
            var width = ((cur + 1) / all * 100).toFixed(2) + '%';
            lettersSliderFill.css('width', width);
        }

        function renderLettersList() {
            var eventsVal = filterEvents.val(),
                tagsVal = filterTags.val(),
                yearVal = filterYear.val(),
                url, urlTags, urlEvents;

            if (yearVal === '0') {
                yearVal = '1941&to=1945';
            } else {
                yearVal += '&to=' + yearVal;
            }

            url = '/mails/messages/?tag=' + tagsVal + '&event=' + eventsVal + '&from=' + yearVal;
            urlTags = '/mails/tags/?event=' + eventsVal + '&from=' + yearVal;
            urlEvents = '/mails/events/?tag=' + tagsVal + '&from=' + yearVal;

            $.ajax(url, {
                success: function(data) {
                    var blockList = '';

                    $.each(data, function(key, item) {

                        searchByNameArr[key] = { //массив со всеми именами
                            from: item.from,
                            to  : item.to
                        };

                        searchByNameSet.add(item.from); //коллекция уникальных значений
                        searchByNameSet.add(item.to);

                        var newSliderItem = '<div class="swiper-slide letters__slider-item">' +
                            '<a href="/mails/one-message-may/?id=' + item.id + '" class="letters__slider-item-link" data-fancybox="letters-gallery" data-type="ajax">' +
                            '<img data-src="' + item.files[0] + '" class="swiper-lazy letters__slider-item-img" alt=""><div class="swiper-lazy-preloader"></div>' +
                            // '<div class="swiper-slide-hover"><div class="el_text">' + item.title + '</div></div>' +
                            '</a></div>';

                        blockList = blockList + newSliderItem;
                    });


                    var j = 0;
                    for (var val of searchByNameSet) { //собираем массив для автоподсказок
                        if (val !== '') {
                            searchByNameAuto[j] = {label: val};
                            j++;
                        }
                    }
                    searchByNameSet.clear();
                    searchByNameInput.val('');


                    // Обновить свайпер
                    swiperLetters.removeAllSlides();
                    swiperLetters.appendSlide(blockList);
                    swiperLetters.update();
                    renderFill(swiperLetters.activeIndex, swiperLetters.slides.length);

                    // Обновить попап
                    $('[data-fancybox="letters-gallery"]').fancybox({
                        height: "100%",
                        width: "100%",
                        idleTime: false,
                        touch: false,
                        autoFocus: false,
                        backFocus: false,
                        buttons: [],
                        smallBtn: false,
                        infobar: false,
                        toolbar: false,
                        showCloseButton: false
                    });

                    allSlides = blockList;
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR, textStatus, errorThrown);
                }
            });

            $.ajax(urlTags, {
                success: function(data) {
                    var tagsList = '';

                    if (tagsVal === '0') {
                        tagsList += '<option value="0" selected>Все тэги</option>';
                    } else {
                        tagsList += '<option value="0">Все тэги</option>';
                    }

                    $.each(data, function(key, item) {
                        if (tagsVal === item.id) {
                            tagsList += '<option value="' + item.id + '" selected>' + item.name + '</option>';
                        } else {
                            tagsList += '<option value="' + item.id + '">' + item.name + '</option>';
                        }
                    });

                    filterTags.find('option').remove();
                    filterTags.append(tagsList);
                    filterTags.select2('destroy');
                    initSelect(filterTags);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR, textStatus, errorThrown);
                }
            });

            $.ajax(urlEvents, {
                success: function(data) {
                    var eventsList = '';

                    if (eventsVal === '0') {
                        eventsList += '<option value="0" selected>Все события</option>';
                    } else {
                        eventsList += '<option value="0">Все события</option>';
                    }

                    $.each(data, function(key, item) {
                        if (eventsVal === item.id) {
                            eventsList += '<option value="' + item.id + '" selected>' + item.name + '</option>';
                        } else {
                            eventsList += '<option value="' + item.id + '">' + item.name + '</option>';
                        }
                    });

                    filterEvents.find('option').remove();
                    filterEvents.append(eventsList);
                    filterEvents.select2('destroy');
                    initSelect(filterEvents);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR, textStatus, errorThrown);
                }
            });
        }

        if (lettersForm.length) {
            var formFile = lettersForm.find('.js-letters-form-file'),
                formFileNumber = 0,
                formFileMax = formFile.data('size'),
                formMessage = lettersForm.find('.js-letters-form-message'),
                formListWrap = lettersForm.find('.js-letters-form-list-wrap'),
                formList = formListWrap.find('.js-letters-form-list');
            var fileItemTemplate = '<div class="letters__form-item js-letters-item">' +
                '<canvas class="letters__form-item-canvas js-letters-canvas"></canvas>' +
                '<div class="letters__form-item-delete js-letters-item-delete">' +
                '<svg class="ico" width="10" height="10"><use xlink:href="/i/sprite.svg#ico-delete"></use></svg>' +
                '</div></div>';

            var createItem = function(file) {
                var newFile = $(fileItemTemplate).clone();
                formList.append(newFile);

                var reader = new FileReader(),
                    canvas = newFile.find('.js-letters-canvas')[0],
                    ctx = canvas.getContext('2d');

                reader.onloadend = function() {
                    var img = new Image();
                    img.src = reader.result;
                    img.onload = function() {
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0, img.width, img.height);
                    };
                };

                reader.readAsDataURL(file);
                canvas.title = file.name;

                newFile.find('.js-letters-item-delete').on('click', function(e) {
                    e.preventDefault();
                    newFile.remove();
                    formFileNumber--;
                    if (!formFileNumber) {
                        formListWrap.addClass('hidden');
                    }
                });
            };

            var openPopup = function(src, data) {
                var formClear = false;
                $.fancybox.open({
                    src: src,
                    type: "inline",
                    opts: {
                        height: "100%",
                        width: "100%",
                        idleTime: false,
                        touch: false,
                        autoFocus: false,
                        buttons: [],
                        smallBtn: false,
                        showCloseButton: false,
                        afterLoad: function(instance, slide) {
                            var formConfirm = $(slide.$slide).find('.js-form-popup');
                            formConfirm.validate({
                                errorElement: 'span',
                                errorClass: 'error-label',
                                highlight: function(element, errorClass, validClass) {
                                    $(element).parents('.form-group').addClass('has-error').removeClass(validClass);
                                },
                                unhighlight: function(element, errorClass, validClass) {
                                    $(element).parents('.form-group').removeClass('has-error').addClass(validClass);
                                },
                                errorPlacement: function(error, element) {
                                    element.parents('.form-group').find('.help-block').html(error);
                                },
                                rules: {
                                    "MessageForm[userName]": {
                                        required: true
                                    },
                                    "MessageForm[email]": {
                                        required: true,
                                        email: true
                                    },
                                    "MessageForm[agreement]": {
                                        required: true
                                    }
                                },
                                messages: {
                                    "MessageForm[userName]": "Необходимо заполнить «Ваше имя»",
                                    "MessageForm[email]": {
                                        required: "Необходимо заполнить «Ваш Email»",
                                        email: "Неверный формат"
                                    },
                                    "MessageForm[agreement]": "Необходимо подтвердить Ваше согласие"
                                },
                                submitHandler: function(formConfirm) {
                                    var formDataNew = $(formConfirm).find('input');
                                    $.each(formDataNew, function(index, value) {
                                        if (formDataNew[index].value !== '') {
                                            data.append(formDataNew[index].name, formDataNew[index].value);
                                        }
                                    });

                                    // Дополнительно добавили для отправки,
                                    // Чтобы при повторном запросе добавлялся актуальный код
                                    if ($('.g-recaptcha-response').length > 0) {
                                        data.append('g-recaptcha-response', grecaptcha.getResponse());
                                    }

                                    $.ajax({
                                        type: 'post',
                                        url: $(formConfirm).attr('action'),
                                        data: data,
                                        dataType: 'json',
                                        cache: false,
                                        contentType: false,
                                        processData: false,
                                        success: function(data) {
                                            if (data.status === 'success') {
                                                $(formConfirm).find('.js-form-content').addClass('hidden');
                                                $(formConfirm).find('.js-form-success').removeClass('hidden');
                                                formClear = true;
                                            } else {
                                                alert(data.message);
                                            }
                                        }
                                    });
                                }
                            });
                        },
                        afterClose: function() {
                            if (formClear) {
                                $(src).find('.js-form-content').removeClass('hidden');
                                $(src).find('.js-form-success').addClass('hidden');
                                $(src).find('form')[0].reset();
                                $(lettersForm)[0].reset();
                                $(lettersForm).find('.js-letters-item-delete').trigger('click');
                                formClear = false;
                            }
                        }
                    }
                })
            };

            formFile.on('change', function() {
                var files = $(this)[0].files;

                formMessage.addClass('hidden').empty();

                if (files.length) {
                    $.each(files, function(key, file) {
                        var fileExtension = /\.(jpe?g|png|tif)$/i.test(file.name),
                            fileSize = Math.floor(file.size/1024/1024) > formFileMax;

                        if (formFileNumber > 8) {
                            formMessage.removeClass('hidden').html('Слишком большое количество файлов. Не загружайте более 9 файлов.');
                            return false;
                        }
                        if (!fileExtension) {
                            formMessage.removeClass('hidden').html('Неверный формат файла: ' + file.name);
                            return false;
                        }
                        if (fileSize) {
                            formMessage.removeClass('hidden').html('Слишком большой размер файла: ' + file.name);
                            return false;
                        }

                        formFileNumber++;
                        formListWrap.removeClass('hidden');
                        createItem(file);
                    })
                }
            });

            lettersForm.on('afterValidate', function() {
                if (!formFileNumber) {
                    formMessage.removeClass('hidden').html('Необходимо добавить файл(ы)');
                }
            });

            lettersForm.on('beforeSubmit', function() {
                var formData = new FormData(lettersForm[0]);

                if (!formFileNumber) {
                    formMessage.removeClass('hidden').html('Необходимо добавить файл(ы)');
                    return false;
                }

                // if (lettersForm.find('[name="g-recaptcha-response"]').val() === '') {
                //     formMessage.removeClass('hidden').html('Необходимо подтвердить что Вы не робот');
                //     return false;
                // }

                formData.delete('MessageForm[files][]');

                var dataURItoBlob = function (dataURI) {
                    var byteString;
                    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
                        byteString = atob(dataURI.split(',')[1]);
                    } else {
                        byteString = unescape(dataURI.split(',')[1]);
                    }
                    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
                    var ia = new Uint8Array(byteString.length);
                    for (var i = 0; i < byteString.length; i++) {
                        ia[i] = byteString.charCodeAt(i);
                    }
                    return new Blob([ia], {type: mimeString});
                };

                for (var i = 0; i < formFileNumber; i++) {
                    var canvas = formList.find('.js-letters-canvas')[i],
                        dataURL = canvas.toDataURL('image/jpeg', 0.5),
                        blob = dataURItoBlob(dataURL),
                        fileNameCanvas = canvas.title;

                    formData.append('MessageForm[files][]', blob, fileNameCanvas);
                }



                openPopup('#letters__popup', formData);
            }).submit(function(e) {
                e.preventDefault();
            });
        }


        // Window listeners
        var $mobile = $(window).width() <= 992;
        var searchByNameWrapper = $('.search-name'),
            searchByNameInput = $('.search-name__input'),
            searchByNameIcon = $('.search-name__icon'),
            searchByNameArr = [],
            searchByNameAuto = [],
            searchByNameSet = new Set(),
            btnClearFilters = $('.js-filters-filter-clear');
        var swiperLetters;

        if ($('.js-search-wrap[data-type="letters"]').length === 1) {
            searchByNameIcon.click(function() {
                searchByNameInput.val('');

                if (!$mobile) {
                    var inputWidth = $('.js-search-wrap').width();
                } else {
                    var inputWidth = $('.js-letters-filter-wrap').width();
                }

                searchByNameWrapper.toggleClass('_active');
                if (searchByNameWrapper.hasClass('_active')) {
                    searchByNameInput.css({
                        width: inputWidth,
                        padding: '0 38px 0 12px'
                    })
                    $('.autocompleter').css('width', inputWidth);
                } else {
                    //Пустой поиск чтобы вернуть исходные результаты
                    searchByNameInput.trigger('change');

                    searchByNameInput.removeAttr('style');
                    setTimeout(function() {
                        searchByNameInput.blur()
                    }, 200)
                }
            });

            searchByNameInput.autocompleter({
                source: searchByNameAuto,
                empty: false,
                // limit: 100,
                minLength: 1,
                delay: 500,
                cache: false
            });

            searchByNameInput.on('input', function() {
                if ($(this).val() !== '') {
                    btnClearFilters.prop('disabled', false);
                }
            })

            searchByNameInput.on('change', function() {
                var inputVal = $(this).val().toLowerCase();

                setTimeout(function() {
                    searchByNameInput.blur()
                }, 200);

                swiperLetters.removeAllSlides();
                swiperLetters.appendSlide(allSlides);

                if (inputVal !== '') {
                    var currentSlides = swiperLetters.slides;
                    var filteredSlides = '';

                    searchByNameArr.forEach(function(item, index) {
                        if (item.from.toLowerCase().includes(inputVal) || item.to.toLowerCase().includes(inputVal)) {
                            filteredSlides += currentSlides[index].outerHTML;
                        }
                    });

                    // Обновить свайпер
                    swiperLetters.removeAllSlides();
                    if (filteredSlides.length > 0) {
                        swiperLetters.appendSlide(filteredSlides);
                    }
                    swiperLetters.update();
                    renderFill(swiperLetters.activeIndex, swiperLetters.slides.length);

                    // Обновить попап
                    $('[data-fancybox="letters-gallery"]').fancybox({
                        height: "100%",
                        width: "100%",
                        idleTime: false,
                        touch: false,
                        autoFocus: false,
                        backFocus: false,
                        buttons: [],
                        smallBtn: false,
                        infobar: false,
                        toolbar: false,
                        showCloseButton: false
                    });
                }

                if (swiperLetters.slides.length === 0) {
                    $('.swiper-pagination-current').text('0');
                    $('.swiper-pagination-total').text('0');
                } else {
                    $('.swiper-pagination-current').text('1');
                    $('.swiper-pagination-total').text(swiperLetters.slides.length);
                }

                swiperLetters.update();
                // updateFraction();
                // app.initTopbox($('.js_lightbox'));
                swiperLetters.slideTo(0);
            })
        }

    }

    return {
        initLetters: initLetters
    };

})();
