function syncopate(animationName) {
    const elements = new Set();
    let eventTime;

    window.addEventListener("animationstart", event => {
        if (event.animationName === animationName) {
            elements.add(event.target);
        }
    });

    window.addEventListener("animationiteration", event => {
        if (event.animationName === animationName) {
            elements.add(event.target);

            requestAnimationFrame(frameTime => {
                if (frameTime !== eventTime) {
                    restart(elements);
                }

                eventTime = frameTime;
            });
        }
    }, true);

    return {
        free() {

        },

        start() {

        },

        stop() {

        },

        pause() {

        }
    }

    function restart(elements) {
        elements.forEach(el => {
            if (window.getComputedStyle(el).animationPlayState !== "paused") {
                el.style.setProperty("animation", "none");
            }
        });

        setTimeout(() => {
            elements.forEach(el => {
                if (window.getComputedStyle(el).animationPlayState !== "paused") {
                    el.style.removeProperty("animation");
                }
            });
        }, 10);
    }
}
