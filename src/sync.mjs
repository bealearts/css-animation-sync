// 100ms is max browser timer resolution without high precision enabled
const TIMER_RESOLUTION = 100;

export default function sync(animationNameOrNames) {
  const animationNames = new Set(
    Array.isArray(animationNameOrNames) ? animationNameOrNames : [animationNameOrNames]
  );
  const elements = new Map();
  let animationDuration;
  let primaryElement;
  let isPaused = false;

  function shouldSync(event) {
    return animationNames.has(event.animationName);
  }

  function validate(el) {
    const isValid = document.body.contains(el);
    if (!isValid) {
      if (el === primaryElement) {
        primaryElement = null;
      }
      elements.delete(el);
    }
    return isValid;
  }

  function findPrimaryElement(timeStamp) {
    const elementsByTimeStamp = Array.from(elements)
      .sort((a, b) => b[1] - a[1]);

    return {
      element: elementsByTimeStamp[0][0],
      timeStamp
    };
  }

  function animationIteration(event) {
    if (shouldSync(event)) {
      const { target: element, timeStamp } = event;
      elements.set(element, timeStamp);

      if (!animationDuration) {
        animationDuration = cssToMs(window.getComputedStyle(element).animationDuration);
      }

      if (primaryElement) {
        const diff = timeStamp - primaryElement.timeStamp;
        if (element !== primaryElement.element && diff > (animationDuration - TIMER_RESOLUTION)) {
          primaryElement = null;
        } else {
          validate(primaryElement.target);
        }
      }

      if (!primaryElement) {
        primaryElement = findPrimaryElement(timeStamp);
      }

      if (element === primaryElement.element) {
        primaryElement.timeStamp = timeStamp;
      } else {
        const diff = timeStamp - primaryElement.timeStamp;
        if (diff > TIMER_RESOLUTION) {
          element.style.setProperty('animation-delay', `-${diff}ms`);
        }
      }
    }
  }

  window.addEventListener('animationiteration', animationIteration, true);


  return {
    getElements() {
      return new Set(elements.keys());
    },

    free() {
      window.removeEventListener('animationiteration', animationIteration, true);

      this.start();
      elements.clear();
      primaryElement = null;
    },

    start() {
      elements.forEach((ts, el) => {
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
      elements.forEach((ts, el) => {
        if (validate(el)) {
          el.style.setProperty('animation', 'none');
        }
      });
    },

    pause() {
      isPaused = true;
      elements.forEach((ts, el) => {
        if (validate(el)) {
          el.style.setProperty('animation-play-state', 'paused');
        }
      });
    }
  };
}

function cssToMs(time) {
  const num = parseFloat(time, 10);
  const unit = time.match(/m?s/)?.[0];

  switch (unit) {
    case 's':
      return num * 1000;
    case 'ms':
      return num;
    default:
      return 0;
  }
}
