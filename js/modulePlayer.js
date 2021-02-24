;//Player module
var modulePlayer = (function () {
    'use strict';

    var initPlayer = function(playerElement){

        // Local copy of jQuery selectors, for performance.
        var	playerWrap = $(playerElement);

        // Options
        var	opt_play_first = false,
            opt_auto_play = false;

        // A flag to capture the first track
        var first_track = true;

        // Instance jPlayer
        $.each(playerWrap, function(playerIndex, playerItem){
            var playerObject = $(playerItem),
                playerType = playerObject.data('player-type') || "default",
                player = playerObject.find('.js-player'),
                playerVolume = playerObject.find('.js-player-volume'),
                playerPrev = playerObject.find('.jp-previous'),
                playerNext = playerObject.find('.jp-next'),
                playerContainer = playerObject.find('.js-player-container'),
                playerId = playerContainer.attr('id'),
                playerListSlider = playerContainer.find('.js-slider-wrap'),
                playerListItem = playerContainer.find('.js-player-item'),
                playerListItemLength = playerListItem.length,
                playerTrackName = playerContainer.find('.js-player-track-name'),
                playerTrackText = playerContainer.find('.js-player-track-text'),
                playerTrackInfo = playerContainer.find('.js-player-track-info'),
                playerTrackPoster = playerContainer.find('.js-player-track-poster'),
                playerState = playerContainer.find('.js-player-track-state');

            player.jPlayer({
                ready: function () {
                    playerContainer.find(".js-player-item:first-child").click();

                    if(playerType === "event_songs"){
                        var trackIndex = playerObject.data('track-active');
                        playerListItem.eq(trackIndex).trigger('click');
                    }
                },
                timeupdate: function(event) {},
                volumechange: function(event) {
                    if(event.jPlayer.options.muted) {
                        playerVolume.slider("value", 0);
                    } else {
                        playerVolume.slider("value", event.jPlayer.options.volume);
                    }
                },
                play: function() {
                    var bgPlayer = $('.js-music-wrap'),
                        bgPlayerState = bgPlayer.hasClass('state-playing');
                    if(bgPlayer.length > 0 && bgPlayerState){
                        bgPlayer.find('.js-music-tog').trigger('click');
                    }
                    // To avoid multiple jPlayers playing together.
                    $(this).jPlayer("pauseOthers");
                },
                pause: function(event) {},
                ended: function(event) {
                    playerNext.trigger('click');
                },
                //globalVolume : 0.5,
                //swfPath: "../../dist/jplayer",
                useStateClassSkin: true,
                smoothPlayBar: true,
                cssSelectorAncestor: "#"+playerId,
                supplied: "mp3",
                wmode: "window"
            });

            // Create click handlers for the different tracks
            playerListItem.click(function(e) {
                var it = $(this),
                    trackIndex = it.index(),
                    trackActive = it.hasClass('active'),
                    isLast = trackIndex + 1 === playerListItemLength,
                    isFirst = trackIndex === 0,
                    track = {
                        id: it.data('id') || false,
                        name: it.data('name') || "",
                        info: it.data('info') || "",
                        src: it.data('src'),
                        poster: it.data('poster') || false,
                        imageAuthor: it.data('image-author') || "",
                        imageText: it.data('image-text') || ""
                    };

                if(!trackActive){
                    playerListItem.removeClass('active');
                    it.addClass('active');
                }

                if(playerListSlider.length > 0){
                    var playerListSliderInstance = playerListSlider.find('.js-slider-container')[0].swiper;
                    playerListSliderInstance.slideTo(trackIndex);
                }

                switch(playerType) {
                    case("mini"):
                        playerTrackName.text(track['name']);
                        playerTrackInfo.text(track['info']);
                        isLast ? playerNext.parent().addClass('disabled') : playerNext.parent().removeClass('disabled');
                        isFirst ? playerPrev.parent().addClass('disabled') : playerPrev.parent().removeClass('disabled');
                        break;
                    case("songs"):
                        playerTrackText.data('song-id', track['id']);
                        playerTrackName.text(track['name']);
                        playerTrackInfo.text(track['info']);

                        var img = new Image();
                        img.src = track['poster'];
                        player.jPlayer("pause");
                        playerTrackPoster.css("background-image", "");
                        player.append('        <div class="main-loader1 main-loader1--songs js-loader">\n' +
                            '            <div class="main-loader__inner1"></div>\n' +
                            '        </div>');
                        img.addEventListener('load', function() {
                            playerTrackPoster.css("background-image", "url("+track['poster']+")");
                            handleAudio();
                            player.find('.js-loader').remove();
                        });

                        img.addEventListener('error', function() {
                            handleAudio();
                            player.find('.js-loader').remove();
                        });

                        isLast ? playerNext.parent().addClass('disabled') : playerNext.parent().removeClass('disabled');
                        isFirst ? playerPrev.parent().addClass('disabled') : playerPrev.parent().removeClass('disabled');
                        break;
                    case("event_songs"):
                        var playerTrackImgAuthor = playerContainer.parents().find('.js-player-track-img-author'),
                            playerTrackImgInfo = playerContainer.parents().find('.js-player-track-img-info'),
                            playerTrackTextList = playerContainer.parents().find('.js-player-track-text-list');

                        playerTrackName.text(track['name']);
                        playerTrackInfo.text(track['info']);
                        playerTrackPoster.css("background-image", "url("+track['poster']+")");
                        playerTrackImgAuthor.text(track['imageAuthor']);
                        playerTrackImgInfo.text(track['imageText']);

                        playerTrackTextList.find('.js-player-track-text-item').removeClass('active');
                        playerTrackTextList.find('.js-player-track-text-item').eq(trackIndex).addClass('active');

                        opt_auto_play = true;
                        break;
                    case("single"):
                        break;
                    default:
                        break;
                }


                if(playerType !== 'songs') {
                    player.jPlayer("setMedia", {
                        mp3: track['src']
                    });
                    if((opt_play_first && first_track) || (opt_auto_play && !first_track)) {
                        player.jPlayer("play");
                    }
                    first_track = false;
                }
                $(this).blur();

                function handleAudio() {
                    player.jPlayer("setMedia", {
                        mp3: track['src']
                    });
                    opt_auto_play = true;
                    if((opt_play_first && first_track) || (opt_auto_play && !first_track)) {
                        player.jPlayer("play");
                    }
                    first_track = false;
                }

                return false;
            });

            playerTrackText.on('click', function(e){
                e.preventDefault();

                var songId = $(this).data('song-id');

                $.fancybox.open({
                    src: "/ajax/getsong/?id="+songId,
                    type: "ajax",
                    opts: {
                        slideClass: "popup-song",
                        baseClass: "",
                        height: "100%",
                        width: "100%",
                        idleTime: false,
                        touch: false,
                        autoFocus: false,
                        buttons: [],
                        smallBtn: false,
                        afterShow: function(instance, slide) {
                            var scrollbarInitialized = false;

                            initCustomScrollbar();

                            moduleResize.width({
                                userFunction: initCustomScrollbar
                            });

                            function initCustomScrollbar() {
                                if(!scrollbarInitialized && window.matchMedia('(min-width: 1024px)').matches) {
                                    $('.js-popup-song-text-scroll').mCustomScrollbar({
                                        scrollInertia: 725,
                                        mouseWheel: {
                                            scrollAmount: 125
                                        }
                                    });
                                    scrollbarInitialized = true;
                                }
                            }
                        }
                    }
                })
            });

            if(playerVolume.length > 0){
                var sliderOrientation = ($(window).width() > 767) ? "horizontal" : "vertical";
                var volBtn = playerContainer.find('.vol-btn');
                playerVolume.slider({
                    animate: "fast",
                    max: 1,
                    range: "min",
                    step: 0.01,
                    value: 0.8,
                    orientation: sliderOrientation,
                    slide: function(event, ui) {
                        player.jPlayer("option", "muted", false);
                        player.jPlayer("option", "volume", ui.value);
                    },
                    start: function () {
                        if(volBtn.length) {
                            volBtn.addClass('vol-btn--active');
                        }
                    },
                    stop: function () {
                        if(volBtn.length) {
                            volBtn.removeClass('vol-btn--active');
                        }
                    }
                });
            }

            playerPrev.on('click', function(e){
                e.preventDefault();

                var activeTrack = playerContainer.find(".js-player-item.active"),
                    activeTrackIndex = activeTrack.index() || 0;

                if(first_track){
                    $(this).blur();
                    return false;
                }

                playerListItem.eq(activeTrackIndex - 1).trigger('click');

                if(playerType !== 'songs') {
                    player.jPlayer("play");
                }

                if(playerType === 'mini' || playerType === 'songs') {
                    playerPrev.addClass('in-focus');
                    setTimeout(function() {
                        playerPrev.removeClass('in-focus');
                    }, 1000)
                }
            });

            playerNext.on('click', function(e){
                e.preventDefault();

                var activeTrack = playerContainer.find(".js-player-item.active"),
                    lastTrack = activeTrack.index()+1 === playerListItem.length,
                    activeTrackIndex = activeTrack.index() || 0;

                if(lastTrack){
                    playerListItem.eq(0).trigger('click');
                    player.jPlayer("play");
                    return false;
                }

                playerListItem.eq(activeTrackIndex + 1).trigger('click');

                if(playerType !== 'songs') {
                    player.jPlayer("play");
                }

                if(playerType === 'mini' || playerType === 'songs') {
                    playerNext.addClass('in-focus');
                    setTimeout(function() {
                        playerNext.removeClass('in-focus');
                    }, 1000)
                }
            });

        });
    };

    return {
        initPlayer: initPlayer
    };

})();