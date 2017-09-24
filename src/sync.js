
export default function sync(animationName) {
    const elements = new Set();
    let eventTime;

    function animationStart(event) {
        if (event.animationName === animationName) {
            elements.add(event.target);
        }
    }

    function animationIteration(event) {
        if (event.animationName === animationName) {
            elements.add(event.target);

            requestAnimationFrame(frameTime => {
                if (frameTime !== eventTime) {
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
                el.style.removeProperty('animation');
            });
        },

        stop() {
            elements.forEach(el => {
                el.style.setProperty('animation', 'none');
            });
        },

        pause() {
            elements.forEach(el => {
                el.style.setProperty('animation-play-state', 'paused');
            });
        }
    };
}


function restart(elements) {
    elements.forEach(el => {
        if (window.getComputedStyle(el).animationPlayState !== 'paused') {
            el.style.setProperty('animation', 'none');
        }
    });

    requestAnimationFrame(() => {
        elements.forEach(el => {
            if (window.getComputedStyle(el).animationPlayState !== 'paused') {
                el.style.removeProperty('animation');
            }
        });
    });
}
