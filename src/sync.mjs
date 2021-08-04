
export default function sync(animationNameOrNames) {
  const animationNames = new Set(
    Array.isArray(animationNameOrNames) ? animationNameOrNames : [animationNameOrNames]
  );
  const elements = new Set();
  let animationDuration;
  let isPaused = false;
  let lastInterationTimestamp = 0;

  function shouldSync(event) {
    return animationNames.has(event.animationName);
  }

  function validate(el) {
    const isValid = document.body.contains(el);
    if (!isValid) {
      elements.delete(el);
    }
    return isValid;
  }

  function init() {
    setTimeout(restart, animationDuration);
  }

  function restart() {
    this.stop();
    setTimeout(this.start, 50);
  }

  function animationStart(event) {
    if (shouldSync(event)) {
      const { target: element, timeStamp } = event;
      elements.add(element);

      const diff = timeStamp - lastInterationTimestamp;
      element.style.setProperty('animation-delay', `-${diff}ms`);
    }
  }


  function animationIteration(event) {
    if (shouldSync(event)) {
      const { target: element, timeStamp } = event;
      elements.add(element);

      lastInterationTimestamp = timeStamp;

      if (!animationDuration) {
        animationDuration = cssToMs(window.getComputedStyle(element).animationDuration);
        init();
      }
    }
  }

  window.addEventListener('animationiteration', animationIteration, true);
  window.addEventListener('animationstart', animationStart, true);


  return {
    getElements() {
      return elements;
    },

    free() {
      window.removeEventListener('animationiteration', animationIteration, true);
      window.removeEventListener('animationstart', animationStart, true);

      this.start();
      elements.clear();
    },

    start() {
      elements.forEach((el) => {
        if (validate(el)) {
          if (isPaused) {
            el.style.removeProperty('animation-play-state');
          } else {
            el.style.removeProperty('animation');
          }
        }
      });
      isPaused = false;
    },

    stop() {
      isPaused = false;
      elements.forEach((el) => {
        if (validate(el)) {
          el.style.setProperty('animation', 'none');
        }
      });
    },

    pause() {
      isPaused = true;
      elements.forEach((el) => {
        if (validate(el)) {
          el.style.setProperty('animation-play-state', 'paused');
        }
      });
    }
  };
}

function cssToMs(time) {
  const num = parseFloat(time, 10);
  let unit = time.match(/m?s/);

  if (!unit) return 0;

  [unit] = unit;

  switch (unit) {
    case 's':
      return num * 1000;
    case 'ms':
      return num;
    default:
      return 0;
  }
}
