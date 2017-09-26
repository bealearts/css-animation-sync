
const defaultOptions = {
    graceful: true
};

export default function sync(animationName, options = {}) {
    const opts = {
        ...defaultOptions,
        ...options
    };

    const elements = new Set();
    let eventTime;
    let lastInterationTS = now();
    let interationDuration = 0;

    function animationStart(event) {
        if (event.animationName === animationName) {
            const el = event.target;

            if (opts.graceful && !elements.has(el) && interationDuration !== 0) {
                gracefulStart(el, interationDuration, lastInterationTS);
            }

            elements.add(el);
        }
    }

    function animationIteration(event) {
        if (event.animationName === animationName) {
            elements.add(event.target);

            requestAnimationFrame(frameTime => {
                if (frameTime !== eventTime) {
                    interationDuration = now() - lastInterationTS;
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


function gracefulStart(el, interationDuration, lastInterationTS) {
    const remaining = interationDuration - (now() - lastInterationTS);
    console.log(interationDuration, remaining);
    el.style.setProperty('animation-duration', remaining);
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
