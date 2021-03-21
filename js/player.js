'use strict';

// ==============

let $playButton = document.querySelectorAll('.play-button');

if ($playButton.length) {
  // Ищем на странице class="play-button""
  for (let i = 0; i < $playButton.length; i++) {
    $playButton[i].addEventListener('click', (event) => {
      // let target = event.eventPhase;
      let target = event.target;
      // console.log('target =>', event.target);
      console.log('event.eventPhase =>', event.eventPhase);
      // console.log('event.currentTarget =>', event.currentTarget);
      event.preventDefault();
      let audioId = target.parentElement.getAttribute('audio-id');
      console.log('click =>', audioId);
    });
  }
}
//===============

let audio_prev_src = '';
let userInteractedWithDOM = false;
let playClicked = false;
const customPlayers = document.querySelectorAll('.custom-audio-player');
let touchScreen = false;

window.ontouchstart = () => {
  touchScreen = true;
};

window.onclick = () => {
  userInteractedWithDOM = true;
};

window.onload = () => {
  const customPlayers = document.querySelectorAll('.custom-audio-player');

  for (let i = 0; i < customPlayers.length; i++) {
    const audioObj = customPlayers[i].querySelector('.audioObj');
    const playBttn = customPlayers[i].querySelector('.play-bttn');
    const $playButton = customPlayers[i].querySelector('.play-button'); 
    const currTimeLbl = customPlayers[i].querySelector('.current-time');
    const rangeSlider = customPlayers[i].querySelector('.range-slider-audio');
    const audioLenLbl = customPlayers[i].querySelectorAll('.audio-length');
    const audioSource = audioObj.querySelector('source').src;
    // const playbackBttn = customPlayers[i].querySelector('.playback-speed');
    // const playbackRangeSlider = customPlayers[i].querySelector(
    //   '.range-slider-audio-playback'
    // );
    const soundRangeSlider = customPlayers[i].querySelector(
      '.range-slider-audio-sound'
    );
    const soundBttn = customPlayers[i].querySelector('.sound-bttn');
    const soundIcon = customPlayers[i].querySelector('.speaker');
    // const tooltipAct = customPlayers[i].querySelector('.tooltip');
    // const tooltipOptions = tooltipAct.querySelectorAll('.tooltip-option');
    // const timingLabel = tooltipAct.querySelector('.audio-timing');
    let lc_object = { audioCurrentTime: 0, marks: [] };

    let lastTime_lc = 0;
    audioObj.preload = 'metadata';
    // playbackRangeSlider.value = 18.9;
    customPlayers[i].style['z-index'] = customPlayers.length - i;

    if (localStorage.getItem(customPlayers[i].getAttribute('audio-id'))) {
      lc_object = JSON.parse(
        localStorage.getItem(customPlayers[i].getAttribute('audio-id'))
      );

      currTimeLbl.innerText = formatTime(
        parseFloat(lc_object.audioCurrentTime)
      );
      audioObj.currentTime = parseFloat(lc_object.audioCurrentTime);

      // for (let mark of lc_object.marks) {
      //   const w_mark = document.createElement('div');
      //   w_mark.classList.add('mark');
      //   w_mark.classList.add(mark.condition);
      //   w_mark.style['left'] = `calc(${mark.percent}% - 2.5px)`;
      //   rangeSlider.parentElement
      //     .querySelector('.watermarks')
      //     .appendChild(w_mark);

      //   w_mark.onmouseenter = () => {
      //     const mark_tooltip = document.createElement('div');
      //     mark_tooltip.classList.add('mark-tooltip');
      //     mark_tooltip.innerHTML = `<div class="tooltip-mark-item">###<span>${formatTime(
      //       mark.time
      //     )}</span><span>${
      //       tooltipOptions[parseInt(mark.option) - 1].innerText
      //     }</span></div>`;
      //     w_mark.appendChild(mark_tooltip);

      //     w_mark.onmouseleave = () => {
      //       mark_tooltip.remove();
      //     };
      //   };
      // }
    } else {
      currTimeLbl.innerText = '0:00';
      audioObj.currentTime = 0;
    }

    $playButton.onclick = (e) => {
      playBttn.classList.toggle('playing');
      const playInactive = $playButton.classList.contains('unchecked');
      if (playBttn.getAttribute('class').includes('playing') && playInactive) {
        audioObj.play();
        stopAllAudios(customPlayers[i]);
      } else {
        audioObj.pause();
      }
    };

    playBttn.onclick = () => {
      stopAllAudios(customPlayers[i]);
      playBttn.classList.toggle('playing');
      if (playBttn.getAttribute('class').includes('playing')) {
        audioObj.play();
      } else {
        audioObj.pause();
      }
    };

    // playbackBttn.onclick = () => {
    //   customPlayers[i].querySelector('.playback-option').classList.toggle('list-displayed');
    //   customPlayers[i].querySelector('.sound-option').classList.remove('list-displayed');
    // }

    // playbackRangeSlider.oninput = () => {
    //   const playbackRate = ((playbackRangeSlider.value / 25) + 0.25).toFixed(2);
    //   playbackBttn.querySelector('span').innerText = `x${playbackRate}`;
    //   audioObj.playbackRate = playbackRate;
    // }

    soundBttn.onclick = () => {
      customPlayers[i]
        .querySelector('.sound-option')
        .classList.toggle('list-displayed');
      // customPlayers[i]
      //   .querySelector('.playback-option')
      //   .classList.remove('list-displayed');
      soundBttn.classList.toggle('svg-green');
    };

    soundRangeSlider.oninput = () => {
      const audVolume = soundRangeSlider.value / 100;
      audioObj.volume = audVolume;

      if (audVolume >= 0.5) {
        soundIcon.attributes.d.value =
          'M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z';
      } else if (audVolume < 0.5 && audVolume > 0.05) {
        soundIcon.attributes.d.value =
          'M0 7.667v8h5.333L12 22.333V1L5.333 7.667M17.333 11.373C17.333 9.013 16 6.987 14 6v10.707c2-.947 3.333-2.987 3.333-5.334z';
      } else if (audVolume <= 0.05) {
        soundIcon.attributes.d.value =
          'M0 7.667v8h5.333L12 22.333V1L5.333 7.667';
      }
    };

    audioObj.ontimeupdate = () => {
      currTimeLbl.textContent = formatTime(audioObj.currentTime);
      rangeSlider.value = (audioObj.currentTime / audioObj.duration) * 100;
      //rangeSlider.style['filter'] = `hue-rotate(${rangeSlider.value * 3.6}deg)`;
      lc_object.audioCurrentTime = audioObj.currentTime;

      localStorage.setItem(
        customPlayers[i].getAttribute('audio-id'),
        JSON.stringify(lc_object)
      );

      if (audioObj.currentTime == audioObj.duration) {
        playBttn.classList.remove('playing');
      }

      for (let j = 0; j < audioLenLbl.length; j++) {
        if (audioLenLbl[j].innerText != formatTime(audioObj.duration)) {
          audioLenLbl[j].innerText = formatTime(audioObj.duration);
        }
      }
    };

    audioObj.onended = () => {
      if (userInteractedWithDOM) {
        if (i + 1 != customPlayers.length) {
          customPlayers[i + 1].querySelector('.audioObj').play();
          customPlayers[i + 1]
            .querySelector('.play-bttn')
            .classList.add('playing');
        } else {
          customPlayers[0].querySelector('.audioObj').play();
          customPlayers[0].querySelector('.play-bttn').classList.add('playing');
        }
      }
    };

    audioObj.onloadedmetadata = () => {
      for (let j = 0; j < audioLenLbl.length; j++) {
        audioLenLbl[j].innerText = formatTime(audioObj.duration);
      }
    };

    rangeSlider.oninput = () => {
      audioObj.currentTime = audioObj.duration * (rangeSlider.value / 100);
    };

    let elementBounds;
    let timing;
    let percent;

    // rangeSlider.onmousemove = (e) => {
    //   if (!touchScreen) {
    //     elementBounds = rangeSlider.getBoundingClientRect();
    //     percent = ((e.pageX - elementBounds.left) / elementBounds.width) * 100;
    //     timing = audioObj.duration * (percent / 100);
    //     tooltipAct.style['left'] = `${percent}%`;
    //     if (timing < 0) {
    //       timing = 0;
    //       tooltipAct.classList.remove('show-tooltip');
    //     } else if (timing > audioObj.duration) {
    //       tooltipAct.classList.remove('show-tooltip');
    //       timing = audioObj.duration;
    //     } else {
    //       tooltipAct.classList.add('show-tooltip');
    //     }

    //     timingLabel.innerText = formatTime(timing);
    //   }
    // };

    // rangeSlider.onmouseenter = () => {
    //   if (!touchScreen) {
    //     tooltipAct.classList.add('show-tooltip');
    //   }
    // };
    // rangeSlider.parentElement.querySelector(
    //   '.watermarks'
    // ).onmouseenter = () => {
    //   tooltipAct.classList.remove('show-tooltip');
    // };
    // rangeSlider.parentElement.onmouseleave = () => {
    //   tooltipAct.classList.remove('show-tooltip');
    // };

    rangeSlider.onclick = () => {
      audioObj.currentTime = timing;
    };

    // for (let tooltipOption of tooltipOptions) {
    //   tooltipOption.onclick = () => {
    //     const option = tooltipOption.getAttribute('data-id-react');
    //     const w_mark = document.createElement('div');
    //     const timingConst = timing;
    //     w_mark.classList.add('mark');
    //     w_mark.classList.add(tooltipOption.getAttribute('data-condition'));
    //     w_mark.style['left'] = `calc(${percent}% - 2.5px)`;
    //     rangeSlider.parentElement
    //       .querySelector('.watermarks')
    //       .appendChild(w_mark);

    //     w_mark.onmouseenter = () => {
    //       const mark_tooltip = document.createElement('div');
    //       mark_tooltip.classList.add('mark-tooltip');
    //       mark_tooltip.innerHTML = `<div class="tooltip-mark-item">***<span>${formatTime(
    //         timingConst
    //       )}</span><span>${
    //         tooltipOptions[parseInt(option) - 1].innerText
    //       }</span></div>`;
    //       w_mark.appendChild(mark_tooltip);

    //       w_mark.onmouseleave = () => {
    //         mark_tooltip.remove();
    //       };
    //     };

    //     lc_object.marks.push({
    //       time: timing,
    //       percent: percent,
    //       option: option,
    //       condition: tooltipOption.getAttribute('data-condition'),
    //     });

    //     localStorage.setItem(
    //       customPlayers[i].getAttribute('audio-id'),
    //       JSON.stringify(lc_object)
    //     );
    //   };
    // }

    customPlayers[i].classList.add('opacity-1');
  }
};

const formatTime = (time) => {
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60);
  return min + ':' + (sec < 10 ? '0' + sec : sec);
};

const stopAllAudios = (cPlayer) => {
  for (let customPlayer of customPlayers) {
    if (customPlayer !== cPlayer) {
      customPlayer.querySelector('.audioObj').pause();
      customPlayer.querySelector('.play-bttn').classList.remove('playing');
    }
  }
};
