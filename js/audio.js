let audio = document.getElementById('audio-player');

$(document).ready(function () {
  $('.play-button').click(function () {
    let player = $(this).parent();

    let track = player.attr('data-audio');
    // let trackSrc = $('.audio-player').children().attr('src', track);
    $('#track').attr('src', track);

    // console.log('track=>', track);
    // console.log('rackSrc=>', trackSrc);

    if ($(this).hasClass('unchecked')) {
      $(this)
        .addClass('play-active')
        .removeClass('play-inactive')
        .removeClass('unchecked');
      player.find('.info-two').addClass('info-active');
      player.find('.control-row').addClass('audio-bg');
      player.find('.pause-button').addClass('scale-animation-active');
      player
        .find(
          '.pause-button, .seek-field, .volume-icon, .volume-field, .info-two'
        )
        .show();
      player
        .find('.pause-button')
        .children('.icon')
        .addClass('icon-pause')
        .removeClass('icon-play');
      setTimeout(function () {
        player.find('.info-one').hide();
      }, 400);
      audio.play();
      audio.currentTime = 0;
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
      player.find('.control-row').removeClass('audio-bg');
      player
        .find(
          '.waves-animation-one, .pause-button, .seek-field, .volume-icon, .volume-field, .info-two'
        )
        .hide();
      player.find('.waves-animation-two').show();
      setTimeout(function () {
        player.find('.info-one').show();
      }, 150);
      audio.pause();
      audio.currentTime = 0;
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

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  });

  // $('.play-button').click(function () {
  //   setTimeout(function () {
  //     $('.play-button')
  //       .children('.icon')
  //       .toggleClass('icon-play')
  //       .toggleClass('icon-cancel');
  //   }, 350);
  // });
  // $('.like').click(function () {
  //   $('.icon-heart').toggleClass('like-active');
  // });
});

function CreateSeekBar() {
  let seekbar = document.getElementById('audioSeekBar');
  seekbar.min = 0;
  seekbar.max = audio.duration;
  seekbar.value = 0;
}

function EndofAudio() {
  document.getElementById('audioSeekBar').value = 0;
}

function audioSeekBar() {
  let seekbar = document.getElementById('audioSeekBar');
  audio.currentTime = seekbar.value;
}

function SeekBar() {
  let seekbar = document.getElementById('audioSeekBar');
  seekbar.value = audio.currentTime;
}

audio.addEventListener(
  'timeupdate',
  function () {
    let duration = document.getElementById('duration');
    let s = parseInt(audio.currentTime % 60);
    let m = parseInt((audio.currentTime / 60) % 60);
    duration.innerHTML = m + ':' + s;
  },
  false
);
//
// Waves.init();
// Waves.attach('.play-button', ['waves-button', 'waves-float']);
// Waves.attach('.pause-button', ['waves-button', 'waves-float']);
