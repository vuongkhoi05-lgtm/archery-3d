export function initMobileControls({
    onAim,
    onStart,
    onRelease
}) {

    const canvas =
        document.querySelector("canvas");

    if (!canvas) return;


    let touching = false;


    canvas.addEventListener(
        "touchstart",
        event => {

            if (
                event.touches.length !== 1
            ) {
                return;
            }

            event.preventDefault();

            touching = true;

            const touch =
                event.touches[0];

            onStart(
                touch.clientX,
                touch.clientY
            );
        },
        {
            passive: false
        }
    );


    canvas.addEventListener(
        "touchmove",
        event => {

            if (!touching) return;

            event.preventDefault();

            const touch =
                event.touches[0];

            onAim(
                touch.clientX,
                touch.clientY
            );
        },
        {
            passive: false
        }
    );


    canvas.addEventListener(
        "touchend",
        event => {

            if (!touching) return;

            event.preventDefault();

            touching = false;

            onRelease();
        },
        {
            passive: false
        }
    );
}