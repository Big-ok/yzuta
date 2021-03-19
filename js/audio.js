// const customPlayers = document.querySelectorAll('.custom-audio-player');

// for (let i = 0; i < customPlayers.length; i++) {

//   const audioObj = customPlayers[i].querySelector('.audioObj');
//    const playButton = document.querySelector('.play-button');

// }

$(document).ready(function () {
  $('.play-button').click(function () {
    // playButton[i].click(function () {
    let player = $(this).parent();

    let track = player.attr('data-audio');

    $('#track').attr('src', track);

    if ($(this).hasClass('unchecked')) {
      $(this)
        .addClass('play-active')
        .removeClass('play-inactive')
        .removeClass('unchecked');
      player.find('.info-two').addClass('info-active');
      // player.find('.control-row').addClass('audio-bg');
      player.find('.pause-button').addClass('scale-animation-active');
      player
        .find(
          '.waves-animation-one, .pause-button, .seek-field, .volume-icon, .volume-field, .info-two'
        )
        .show();
      player.find('.waves-animation-two').hide();
      player
        .find('.pause-button')
        .children('.icon')
        .addClass('icon-pause')
        .removeClass('icon-play');
      setTimeout(function () {
        player.find('.info-one').hide();
        player.find('.player-bar').show();
      }, 400);
      // audio.play();
      // audio.currentTime = 0;
    } else {
      $(this)
        .removeClass('play-active')
        .addClass('play-inactive')
        .addClass('unchecked');
      player
        .find('.pause-button')
        .children('.icon')
        .addClass('icon-pause')
        .removeClass('icon-play');
      player.find('.info-two').removeClass('info-active');
      // player.find('.control-row').removeClass('audio-bg');
      player
        .find(
          '.waves-animation-one, .pause-button, .seek-field, .volume-icon, .volume-field, .info-two'
        )
        .hide();
      player.find('.waves-animation-two').show();
      setTimeout(function () {
        player.find('.info-one').show();
        player.find('.player-bar').hide();
      }, 150);
      // audio.pause();
      // audio.currentTime = 0;
    }

    setTimeout(function () {
      $(this)
        .children('.icon')
        .toggleClass('icon-play')
        .toggleClass('icon-cancel');
    }, 350);
  });

  $('.pause-button').click(function () {
    $(this)
      .children('.icon')
      .toggleClass('icon-pause')
      .toggleClass('icon-play');
  });
});

Waves.init();
Waves.attach('.play-button', ['waves-button', 'waves-float']);
Waves.attach('.pause-button', ['waves-button', 'waves-float']);
