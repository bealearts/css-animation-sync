
// import sync from '../src/sync.mjs';
import sync from 'https://unpkg.com/css-animation-sync@0.4.0-beta-1/dist/sync.js';

let animation;

function enableSync(enable) {
  if (enable) {
    animation = sync(['spinner', 'alert']);
  } else if (animation) {
    animation.free();
  }

  enableButtons(enable);
}

function enableButtons(enable) {
  document.querySelectorAll('Button').forEach(button => {
    button.disabled = !enable;  // eslint-disable-line
  });
}

function onLoad() {
  enableButtons(false);

  ['#two', '#three', '#four'].forEach((name, index) => {
    setTimeout(() => {
      const el = document.querySelector(name);
      el.className += ' spinner';
    }, 700 * (index + 1));
  });
}

function start() {
  animation.start();
}

function pause() {
  animation.pause();
}

function stop() {
  animation.stop();
}

// Export global for demo
window.enableSync = enableSync;
window.start = start;
window.pause = pause;
window.stop = stop;
window.onload = onLoad;
