const audioContext = new AudioContext();

// create the graph
const env = audioContext.createGain();
env.connect(audioContext.destination);

const sine = audioContext.createOscillator();
sine.frequency.value = 600;
sine.connect(env);

/*
// v1
// start
sine.start();
// stop after 3 seconds
setTimeout(() => { sine.stop(); }, 2 * 1000);
*/

// v2
const now = audioContext.currentTime; // second
// schedule the start and stop of the sine
sine.start(now);
sine.stop(now + 2);
// schedule the envelop of the gain
env.gain.setValueAtTime(0, now);
env.gain.linearRampToValueAtTime(1, now + 0.01);
env.gain.exponentialRampToValueAtTime(0.0001, now + 2);
