let audioCtx = null;

export function initAudio() {

    if (!audioCtx) {

        audioCtx =
        new (
            window.AudioContext ||
            window.webkitAudioContext
        )();
    }
}

export function stepSound(
    type = "walk"
) {

    if (!audioCtx) return;

    const osc =
    audioCtx.createOscillator();

    const gain =
    audioCtx.createGain();

    osc.connect(gain);

    gain.connect(
        audioCtx.destination
    );

    if (type === "run") {

        osc.frequency.value = 120;
        gain.gain.value = 0.10;

    } else if (
        type === "crouch"
    ) {

        osc.frequency.value = 45;
        gain.gain.value = 0.03;

    } else {

        osc.frequency.value = 80;
        gain.gain.value = 0.08;
    }

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioCtx.currentTime + 0.08
    );

    osc.start();

    osc.stop(
        audioCtx.currentTime + 0.08
    );
}