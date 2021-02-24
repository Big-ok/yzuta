//Photo album module
var moduleAlbum = (function () {
    'use strict';

    var fileitemTemplate = "<div class='photo-album__form-item js-photo-item'>"+
        "<canvas class='photo-album__form-item-canvas js-photo-album-editor-canvas' data-caman=''></canvas>"+
        "<div class='photo-album__form-item-delete js-photo-item-delete'>"+
        "<svg class='ico' width='10' height='10'>"+
        "<use xlink:href='/i/sprite.svg#ico-delete'></use>"+
        "</svg>"+
        "</div>"+
        "</div>";

    var messages = {
        empty: "Необходимо добавить фото",
        extension: "Неверный формат файла",
        size: "Фотография слишком большая"
    };

    var initAlbum = function(albumWrap){
        var album = $(albumWrap),
            albumFilter = album.find('.js-album-filter'),
            albumSlider = album.find('.js-album-slider'),
            albumSliderNav = album.find('.js-album-slider-nav'),
            albumSliderPagination = albumSliderNav.find('.js-album-slider-pagination'),
            albumSliderPrev = albumSliderNav.find('.js-album-slider-prev'),
            albumSliderNext = albumSliderNav.find('.js-album-slider-next'),
            albumSliderContainer = albumSlider.find('.swiper-container'),
            albumForm = album.find('.js-album-form'),
            albumClear = album.find('.js-album-filter-clear'),
            albumBegin = album.find('.js-album-slider-begin');

        albumClear.on('click', function (e) {
            e.preventDefault();
            var $this = $(this);
            if($this.hasClass('disabled')) return;
            if(albumFilter.length) {
                albumFilter.val('').trigger('change');
                albumFilter.eq(0).trigger('select2:select');
            }
            $this.addClass('disabled');
        });

        albumBegin.on('click', () => { swiper.slideTo(0); });

        function getPhotolist(filterPlace, filterYear, filterTag, filterSearch, updateFilters) {
            var data = {
                location: (filterPlace === "0" ? "" : filterPlace),
                year: (filterYear === "0" ? "" : filterYear),
                tag: (filterTag === "0" ? "" : filterTag),
                search: (filterSearch === "0" ? "" : filterSearch)
            };

            $.ajax({
                type: 'GET',
                data: data,
                url: '/ajax/getphotolist/',
                success: function (data) {
                    photoAlbumList = data['data'];
                    renderPhotoList();

                    if (updateFilters) {
                        renderFilters(data['tags'], data['locations']);
                    }
                },
                error: function (error) {
                    console.log('Error', error);
                }
            });
        }

        if(albumFilter.length){

            var oldYear = 0;

            $.each(albumFilter, function(index, val) {
                var filterItem = $(val);

                filterItem.select2({
                    theme: "photo-album",
                    placeholder: filterItem.data('placeholder'),
                    dropdownParent: filterItem.parent('.js-album-filter-wrap'),
                    minimumResultsForSearch: Infinity,
                    width: "100%"
                });

                filterItem.on('select2:select', function() {

                    if($(this).val() !== "0") {
                        albumClear.removeClass('disabled');
                    }

                    var filterPlace = albumFilter.filter('[data-type="place"]').val(),
                        filterYear = albumFilter.filter('[data-type="year"]').val(),
                        filterTag = albumFilter.filter('[data-type="keywords"]').val();

                    // Обновить фильтры если сменился год
                    var updateFilters = (oldYear !== filterYear);


                    // Загрузка по событию
                    getPhotolist(filterPlace, filterYear, filterTag, '', updateFilters);

                    oldYear = filterYear;
                });
            });

            // Предзагрузка
            getPhotolist(null, '1941', null, '', true);


            var albumSliderWrapper = albumSlider.find('.swiper-wrapper'),
                albumSliderOptions = {
                    centeredSlides: true,
                    //centeredSlidesBounds: true,
                    watchOverflow: true,
                    autoHeight: false,
                    preloadImages: false,
                    lazy: {
                        loadPrevNext: true
                    },
                    initialSlide: 1,
                    slidesPerView: 3,
                    spaceBetween: 20,
                    pagination: {
                        el: albumSliderPagination,
                        type: 'fraction',
                        renderFraction: function (currentClass, totalClass) {
                            return '<span class="swiper-pagination-item ' + currentClass + '"></span>' +
                                '<span class="swiper-pagination-item swiper-pagination-item--divider">/</span>' +
                                '<span class="swiper-pagination-item ' + totalClass + '"></span>';
                        }
                    },
                    navigation: {
                        nextEl: albumSliderNext,
                        prevEl: albumSliderPrev
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
                            if (swiper.activeIndex === 0) {
                                albumBegin.prop('disabled', true);
                            } else {
                                albumBegin.prop('disabled', false);
                            }
                        }
                    }
                };

            var swiper = new Swiper(albumSliderContainer[0], albumSliderOptions);

            renderPhotoList();
        }

        if(albumSlider.length){
            initAlbumSlider(albumSlider);
        }

        if(albumForm.length){
            initAlbumForm(albumForm);
        }


        function renderFilters(tags, locations)
        {
            $('.js-album-filter-tags').html('').trigger('change');
            $('.js-album-filter-locations').html('').trigger('change');

            var newOption = new Option('Ключевые слова', 0, false, false);
            $('.js-album-filter-tags').append(newOption);

            newOption = new Option('Место съемки', 0, false, false);
            $('.js-album-filter-locations').append(newOption);

            $.each(tags, function(ind, tag) {
                newOption = new Option(tag.name, tag.id, false, false);
                $('.js-album-filter-tags').append(newOption);
            });
            $('.js-album-filter-tags').trigger('change');

            $.each(locations, function(ind, location) {
                newOption = new Option(location.name, location.id, false, false);
                $('.js-album-filter-locations').append(newOption);
            });
            $('.js-album-filter-locations').trigger('change');
        }

        function renderPhotoList() {

            var setPopupContent = function(slide, info, index) {

                var albumPhotoSlider = slide.find('.js-photo-album-popup-img'),
                    albumPhotoSliderWrapper = albumPhotoSlider.find('.swiper-wrapper'),
                    albumPhotoSliderNav = albumPhotoSlider.find('.js-album-photo-slider-nav'),
                    albumPhotoSliderPagination = albumPhotoSliderNav.find('.js-album-photo-slider-pagination'),
                    albumPhotoSliderPrev = albumPhotoSliderNav.find('.js-album-photo-slider-prev'),
                    albumPhotoSliderNext = albumPhotoSliderNav.find('.js-album-photo-slider-next'),
                    albumPhotoSliderContainer = albumPhotoSlider.find('.swiper-container');

                var tags = [];
                var locations = [];

                var albumPhotoSliderList = '';
                $.each(photoAlbumList, function(key, photoItem) {

                    var newSliderItem =
                        '<div id="'+key+'" class="swiper-slide photo-album__slider-item">'+
                        '<div class="swiper-zoom"></div>' +
                        '<a href="' + photoItem.photo + '" data-background="'+photoItem.photo_preview+'" class="js-popup-photo-zoom photo-album__slider-item-bg swiper-lazy">'+
                        '<span class="swiper-lazy-preloader"></span>'+
                        '</a>'+
                        '</div>';

                    albumPhotoSliderList = albumPhotoSliderList + newSliderItem;
                });

                albumPhotoSliderWrapper.empty();
                albumPhotoSliderWrapper.append(albumPhotoSliderList);

                var swiperPhoto = new Swiper(albumPhotoSliderContainer[0], {
                    initialSlide: index,
                    centeredSlides: false,
                    autoHeight: false,
                    preloadImages: false,
                    lazy: true,
                    slidesPerView: 1,
                    spaceBetween: 20,
                    pagination: {
                        el: albumPhotoSliderPagination,
                        type: 'fraction',
                        renderFraction: function (currentClass, totalClass) {
                            return '<span class="swiper-pagination-item ' + currentClass + '"></span>' +
                                '<span class="swiper-pagination-item swiper-pagination-item--divider">/</span>' +
                                '<span class="swiper-pagination-item ' + totalClass + '"></span>';
                        }
                    },
                    navigation: {
                        nextEl: albumPhotoSliderNext,
                        prevEl: albumPhotoSliderPrev
                    },
                    on: {
                        init: function() {
                            var $photoLinks = $(this.$el).find('.js-popup-photo-zoom');
                            if($photoLinks.length) {
                                $photoLinks.fancybox();
                            }
                        }
                    }
                });

                var albumPhotoText = slide.find('.js-photo-album-popup-content'),
                    albumPhotoTextWrap = slide.find('.js-photo-album-popup-content-wrap'),
                    albumPhotoTextTog = slide.find('.js-photo-album-popup-content-tog'),
                    albumPhotoTextTogWrap = slide.find('.js-photo-album-popup-content-tog-wrap');

                var initTextTog = function(button) {
                    $(button).on('click', function(e) {
                        e.preventDefault();

                        var it = $(this);

                        it.toggleClass('open');
                        albumPhotoTextWrap.toggleClass('active');
                    });
                };

                initTextTog(albumPhotoTextTog);

                swiperPhoto.on('slideChange', function () {
                    var slideId = $(swiperPhoto.slides[swiperPhoto.activeIndex]).attr('id'),
                        slidePhotoInfo = photoAlbumList[slideId];

                    setContent(slidePhotoInfo);

                    if (albumPhotoText.height() > albumPhotoTextWrap.height()) {
                        albumPhotoTextTogWrap.removeClass('hidden');
                    } else {
                        albumPhotoTextTogWrap.addClass('hidden');
                    }
                });

                setContent(info);

                if (albumPhotoText.height() > albumPhotoTextWrap.height()) {
                    albumPhotoTextTogWrap.removeClass('hidden');
                } else {
                    albumPhotoTextTogWrap.addClass('hidden');
                }

                function setContent(collection) {
                    var config = [
                        {
                            selector: '.js-photo-album-popup-name',
                            field: 'name'
                        },
                        {
                            selector: '.js-photo-album-popup-year',
                            field: 'year'
                        },
                        {
                            selector: '.js-photo-album-popup-place',
                            field: 'location'
                        },
                        {
                            selector: '.js-photo-album-popup-content',
                            field: 'text'
                        }
                    ];
                    $(config).each(function(_, obj) {
                        var content = collection[obj.field],
                            $el = slide.find(obj.selector);
                        if (content) {
                            $el.parent().removeClass('hidden');
                            $el.html(content);
                        } else {
                            $el.parent().addClass('hidden');
                            $el.html('');
                        }
                    });
                }
            };

            var blockList = '';
            $.each(photoAlbumList, function(key, photoItem) {

                var newSliderItem =
                    '<div id="'+key+'" class="swiper-slide photo-album__slider-item js-photo-album-popup-photo" data-src="#photo-album__popup-photo" data-year="'+photoItem.year+'" data-keywords="'+photoItem.tags+'" data-shoot_place="'+photoItem.location+'">'+
                    '<div data-background="'+photoItem.photo_preview+'" class="photo-album__slider-item-bg swiper-lazy">'+
                    '<div class="swiper-lazy-preloader"></div>'+
                    '</div>'+
                    '</div>';

                blockList = blockList + newSliderItem;
            });

            // Перенинициализировать свайпер
            swiper.destroy();

            albumSliderWrapper.empty();
            albumSliderWrapper.append(blockList);

            setTimeout(function(){
                swiper = new Swiper(albumSliderContainer[0], albumSliderOptions);
                if (blockList.length === 0) {
                    $('.swiper-pagination-current').text('0');
                    $('.swiper-pagination-total').text('0');
                }
            }, 1500);

            albumSliderWrapper.find('.js-photo-album-popup-photo').on('click', function(){
                var src = $(this).data('src'),
                    photoinfo = photoAlbumList[$(this).attr('id')],
                    slideIndex = swiper.clickedIndex;
                $.fancybox.open({
                    src: $(src).clone(),
                    type: "html",
                    opts: {
                        baseClass: "popup-photo-album-base",
                        slideClass: "popup-photo-album",
                        height: "100%",
                        width: "100%",
                        idleTime: false,
                        touch: false,
                        autoFocus: false,
                        buttons: [],
                        smallBtn: false,
                        afterLoad: function(instance, slide){
                            setPopupContent($(slide.$slide), photoinfo, slideIndex);
                        }
                    }
                })
            });
        }

        // Window listeners
        var $mobile = $(window).width() <= 992;
        var searchByNameWrapper = $('.search-name'),
            searchByNameInput = $('.search-name__input'),
            searchByNameIcon = $('.search-name__icon'),
            btnClearFilters = $('.photo-album-filter-clear');

        if ($('.js-search-wrap[data-type="albums"]').length === 1) {
            searchByNameIcon.click(function () {
                searchByNameInput.val('');

                if (!$mobile) {
                    var inputWidth = $('.js-search-wrap').width();
                } else {
                    var inputWidth = $('.js-album-filter-wrap').width();
                }

                // пустой поиск для возврата всех фото
                if (searchByNameWrapper.hasClass('_active')) {
                    doSearch('');
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
                    setTimeout(function () {
                        searchByNameInput.blur()
                    }, 200)
                }
            });

            searchByNameInput.autocompleter({
                source: '/ajax/searchphotolist/',
                empty: false,
                // limit: 100,
                minLength: 1,
                delay: 500,
                cache: false
            });

            searchByNameInput.on('input', function () {
                if ($(this).val() !== '') {
                    btnClearFilters.prop('disabled', false);
                }
            })

            searchByNameInput.on('change', function() {
                doSearch($(this).val().toLowerCase());
            });
        }

        function doSearch(search)
        {
            var inputVal = search;
            setTimeout(function () {
                searchByNameInput.blur()
            }, 200);

            var filterPlace = '',
                filterYear = '',
                filterTag = '',
                filterSearch = $('.search-name__input').val();
            if (filterSearch === '') {
                filterPlace = albumFilter.filter('[data-type="place"]').val();
                filterYear = albumFilter.filter('[data-type="year"]').val();
                filterTag = albumFilter.filter('[data-type="keywords"]').val();
            }

            // Загрузка по событию
            getPhotolist(filterPlace, filterYear, filterTag, filterSearch, true);
        }
    };

    var initAlbumSlider = function(sliderWrap){};

    var initAlbumForm = function(formWrap){
        var form = $(formWrap),
            formEditor = form.find('.js-album-form-editor'),
            formEditorTog = form.find('.js-album-form-editor-tog'),
            formFile = form.find('.js-album-form-file'),
            formFileEmpty = true,
            formFileMax = formFile.data('size'),
            formMessage = form.find('.js-album-form-message'),
            formListWrap = form.find('.js-album-form-list-wrap'),
            formlist = formListWrap.find('.js-album-form-list');

        if ($(window).width() < 1360) {formFileMax = 1}

        Caman.Filter.register("blackAndWhite", function(grey) {
            this.greyscale();
            this.sepia(10);
            this.exposure(10);
            this.contrast(15);
            return this.vignette("60%",35);
        });

        var createItem = function(file){
            var newFile = $(fileitemTemplate).clone();

            formlist.append(newFile);
            var reader = new FileReader(),
                canvas = formlist.find('.js-photo-album-editor-canvas')[0],
                ctx = canvas.getContext("2d"),
                fileName = "";

            reader.onload = function(e) {
                //newFile.css('background-image', 'url("'+e.target.result+'")');

                var img = new Image();
                img.src = reader.result;
                img.onload = function () {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0, img.width, img.height);
                    canvas.removeAttribute("data-caman-id");
                };

            };

            reader.readAsDataURL(file);

            formlist.find('.js-photo-item-delete').on('click', function(e){
                e.preventDefault();

                $('.photo-editor').hide();

                formListWrap.addClass('hidden');
                formlist.empty();
                formFileEmpty = true;
                formFile.wrap('<form>').closest('form').get(0).reset();
                formFile.unwrap();
            });

            initEditor(formEditor, formlist, file);
        };

        formEditorTog.on('click', function(e){
            e.preventDefault();

            $('.photo-editor').toggle();
        });

        var openPopup = function(src, data){
            var formClear = false;
            $.fancybox.open({
                src: src,
                type: "inline",
                opts: {
                    baseClass: "popup-photo-album-base",
                    slideClass: "popup-photo-album",
                    height: "100%",
                    width: "100%",
                    idleTime: false,
                    touch: false,
                    autoFocus: false,
                    buttons: [],
                    smallBtn: false,
                    afterLoad: function(instance, slide) {
                        var formConfirm = $(slide.$slide).find('.js-form-popup');
                        formConfirm.validate({
                            errorElement: "div",
                            errorClass: "error-label",
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
                                "HomePhotoAlbumForm[userName]": {
                                    required: true
                                },
                                "HomePhotoAlbumForm[email]": {
                                    required: true,
                                    email: true
                                },
                                photoAlbumAgree: {
                                    required: true
                                }
                            },
                            messages: {
                                "HomePhotoAlbumForm[userName]": "Необходимо заполнить «Ваше имя»",
                                "HomePhotoAlbumForm[email]": {
                                    required: "Необходимо заполнить «Ваш Email»",
                                    email: "Неверный формат"
                                },
                                photoAlbumAgree: "Необходимо подтвердить Ваше согласие"
                            },
                            submitHandler: function(formConfirm) {

                                var formDataNew = $(formConfirm).find('input');
                                $.each(formDataNew, function(index, value){
                                    if(formDataNew[index].value !== ""){
                                        data.append(formDataNew[index].name, formDataNew[index].value);
                                    }
                                });

                                // Дополнительно добавили для отправки,
                                // Чтобы при повторном запросе добавлялся актуальный код
                                if ($('.g-recaptcha-response').length > 0) {
                                    data.append('g-recaptcha-response', grecaptcha.getResponse());
                                }
-
                                $.ajax({
                                    type: 'post',
                                    url: $(formConfirm).attr('action'),
                                    data: data,
                                    dataType: 'json',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    success: function(data) {
                                        if (data.status === 'success'){
                                            //form.html(data.message);
                                            $(formConfirm).find('.js-form-content').addClass('hidden');
                                            $(formConfirm).find('.js-form-success').removeClass('hidden');
                                            formClear = true;
                                        } else {
                                            alert(data.message);
                                        }
                                    },
                                    error: function(data) {
                                        alert(data.responseText);
                                    }
                                });
                            }
                        });
                    },
                    afterClose: function(){
                        if(formClear){
                            $(src).find('.js-form-content').removeClass('hidden');
                            $(src).find('.js-form-success').addClass('hidden');
                            $(form)[0].reset();
                            $(form).find('.js-photo-item-delete').trigger('click');
                            $(src).find('form')[0].reset();
                            formClear = false;
                        }
                    }
                }
            })
        };

        var changeForm = function(form, data, type){
            switch(type){
                case("confirm"):
                    openPopup('#photo-album__popup', data);
                    break;
                case("submit"):
                    console.log('this');
                    $.ajax({
                        type: 'post',
                        url: form.attr('action'),
                        data: data,
                        dataType: 'json',
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function(data) {
                            if (data.status === 'success'){
                                //form.html(data.message);
                            } else {
                                alert(data.message);
                            }
                        },
                        error: function(data) {
                            alert(data.responseText);
                        }
                    });
                    break;
                default:
                    break;
            }

        };

        formFile.on('change', function(){
            var file = $(this)[0].files[0] || false,
                fileExtension = /\.(jpe?g|png|tif)$/i.test(file.name),
                fileSize = Math.floor(file.size/1024/1024) > formFileMax;

            if(!fileExtension){
                formFileEmpty = true;
                formMessage.removeClass('hidden').html(messages['extension']);
                formListWrap.addClass('hidden');
                formlist.empty();
                return false;
            }

            if(fileSize){
                formFileEmpty = true;
                formMessage.removeClass('hidden').html(messages['size']);
                formListWrap.addClass('hidden');
                formlist.empty();
                return false;
            }

            formFileEmpty = false;
            formMessage.addClass('hidden').empty();
            formListWrap.removeClass('hidden');

            formlist.empty();
            createItem(file);
        });

        form.on('afterValidate', function() {
            if(formFileEmpty){
                formMessage.removeClass('hidden').html(messages['empty']);
            }
        });

        form.on('beforeSubmit', function() {

            var formData = new FormData(form[0]);

            if(formFileEmpty){
                formMessage.removeClass('hidden').html(messages['empty']);
                return false;
            }

            // if (form.find('[name="g-recaptcha-response"]').val() === '') {
            //     formMessage.removeClass('hidden').html('Необходимо подтвердить что Вы не робот');
            //     return false;
            // }

            formData.delete('HomePhotoAlbumForm[photo][]');

            var dataURItoBlob = function (dataURI) {
                var byteString;
                if (dataURI.split(',')[0].indexOf('base64') >= 0)
                    byteString = atob(dataURI.split(',')[1]);
                else
                    byteString = unescape(dataURI.split(',')[1]);

                var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

                var ia = new Uint8Array(byteString.length);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }

                return new Blob([ia], {type: mimeString});
            };

            var canvas = formlist.find('.js-photo-album-editor-canvas'),
                dataURL = canvas[0].toDataURL('image/jpeg', 0.5),
                blob = dataURItoBlob(dataURL),
                fileNameCanvas = formFile[0].files[0].name;

            formData.append('HomePhotoAlbumForm[photo]', blob, fileNameCanvas);

            $('.photo-editor').hide();
            changeForm(form, formData, "confirm");
        }).submit(function (e) {
            e.preventDefault();
        });
    };

    var initEditor = function(editorWrap, listWrap, file){

        var editor = $(editorWrap),
            editorBusy = false,
            list = $(listWrap),
            canvas = list.find('.js-photo-album-editor-canvas'),
            ctx = canvas[0].getContext("2d");

        var img = new Image(),
            fileName = file.name;

        editor.find('.btn').removeClass('active');

        editor.find('.js-photo-album-editor-btn').off().on('click', function(e){
            e.preventDefault();

            if(editorBusy) {
                return false;
            }

            var it = $(this),
                itText = it.html(),
                effect = it.data('effect');

            it.html("Обработка...");
            it.parent().siblings('.photo-editor__effect').find('.btn').removeClass('active');

            Caman(canvas[0], img, function () {
                editorBusy = true;

                this.revert(false);
                this[effect]();

                this.render(function(){
                    it.html(itText).addClass('active');
                    editorBusy = false;
                });
            });
        });

        editor.find('.js-photo-album-editor-range').off().on('change', function(){
            var cntrst = parseInt($('#contrast').val()),
                brghtnss = parseInt($('#brightness').val()),
                strtn = parseInt($('#saturation').val()),
                vibr = parseInt($('#vibrance').val());

            Caman(canvas[0], img, function () {
                this.revert(false);
                this.contrast(cntrst).brightness(brghtnss).saturation(strtn).vibrance(vibr).render();
            });
        });

        editor.find('.js-photo-album-editor-reset').off().on('click', function(e){
            e.preventDefault();

            Caman(canvas[0], img, function () {
                this.revert();
                $('#brightness').val(0);
                $('#contrast').val(0);
                $('#saturation').val(0);
                $('#vibrance').val(0);

                editor.find('.js-photo-album-editor-btn').removeClass('active');
            });
        });

        editor.find('.js-photo-album-editor-save').off().on('click', function(e){
            e.preventDefault();

            var fileExtension = fileName.slice(-4),
                newFilename;

            if (fileExtension === ".jpg" || fileExtension === ".png") {
                newFilename = fileName.substring(0, fileName.length - 4) + "-edited.jpg";
            }

            editorFileDownload(canvas[0], newFilename);
        });

        var editorFileDownload = function download(canvas, filename) {
            var e,
                link = document.createElement("a");

            link.download = filename;
            link.href = canvas.toDataURL("image/jpeg", 0.8);
            e = new MouseEvent("click");
            link.dispatchEvent(e);
        };

    };

    return {
        initAlbum: initAlbum
    };

})();
