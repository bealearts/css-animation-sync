
export default function sync(animationName) {
  const elements = new Set();
  let eventTime;
  let lastInterationTS = now();
  const shouldSync = Array.isArray(animationName)
    ? (event) => animationName.indexOf(event.animationName) > -1
    : (event) => event.animationName === animationName;

  function animationStart(event) {
    if (shouldSync(event)) {
      const el = event.target;
      const passed = now() - lastInterationTS;
      el.style.setProperty('animation-delay', `${-passed}ms`);
      elements.add(el);
    }
  }

  function animationIteration(event) {
    if (shouldSync(event)) {
      elements.add(event.target);
      requestAnimationFrame(frameTime => {
        if (frameTime !== eventTime) {
          lastInterationTS = now();
          restart(elements);
        }
        eventTime = frameTime;
      });
    }
  }


  window.addEventListener('animationstart', animationStart, true);
  window.addEventListener('animationiteration', animationIteration, true);


  return {
    getElements() {
      return elements;
    },

    free() {
      window.removeEventListener('animationstart', animationStart);
      window.removeEventListener('animationiteration', animationIteration);

      this.start();
      elements.clear();
    },

    start() {
      elements.forEach(el => {
        if (validate(elements, el)) {
          el.style.removeProperty('animation');
        }
      });
    },

    stop() {
      elements.forEach(el => {
        if (validate(elements, el)) {
          el.style.setProperty('animation', 'none');
        }
      });
    },

    pause() {
      elements.forEach(el => {
        if (validate(elements, el)) {
          el.style.setProperty('animation-play-state', 'paused');
        }
      });
    }
  };
}


function restart(elements) {
  elements.forEach(el => {
    if (window.getComputedStyle(el).animationPlayState !== 'paused') {
      if (validate(elements, el)) {
        el.style.setProperty('animation', 'none');
      }
    }
  });

  requestAnimationFrame(() => {
    elements.forEach(el => {
      if (window.getComputedStyle(el).animationPlayState !== 'paused') {
        if (validate(elements, el)) {
          el.style.removeProperty('animation');
        }
      }
    });
  });
}


function now() {
  return (new Date()).getTime();
}


function validate(elements, el) {
  const isValid = document.body.contains(el);
  if (!isValid) {
    elements.delete(el);
  }
  return isValid;
}
