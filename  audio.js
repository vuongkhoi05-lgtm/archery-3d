let audioContext;

function getAudioContext() {
    if (!audioContext) {
        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();
    }

    return audioContext;
}

function sound(
    frequency,
    duration,
    type = "sine"
) {
    const ctx =
        getAudioContext();

    const oscillator =
        ctx.createOscillator();

    const gain =
        ctx.createGain();

    oscillator.type = type;

    oscillator.frequency.value =
        frequency;

    gain.gain.value = .08;

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();

    gain.gain.exponentialRampToValueAtTime(
        .001,
        ctx.currentTime + duration
    );

    oscillator.stop(
        ctx.currentTime + duration
    );
}

export function shootSound() {
    sound(180, .12, "triangle");
}

export function hitSound() {
    sound(500, .1, "square");
}

export function bullseyeSound() {
    sound(700, .1);
    
    setTimeout(() => {
        sound(1000, .15);
    }, 100);
}

export function missSound() {
    sound(100, .15, "sawtooth");
}

export function coinSound() {
    sound(900, .08, "square");
}

export function levelSound() {
    sound(500, .1);

    setTimeout(() => {
        sound(800, .15);
    }, 100);
}