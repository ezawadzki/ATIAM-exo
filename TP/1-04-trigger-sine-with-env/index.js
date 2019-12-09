const audioContext = new AudioContext();

const $start = document.querySelector('#start');
const $trigger = document.querySelector('#trigger');

async function init() {
  // we remove the listener on the start button and the button itself
  $start.removeEventListener('click', init);
  $start.remove();

  // we need to resume the audio context on a user gesture, for security reasons
  await audioContext.resume();
  console.log(audioContext);

  const triggerSine = () => {
  // function triggerSine() {
    const env = audioContext.createGain();
    env.connect(audioContext.destination);

    const sine = audioContext.createOscillator();
    sine.frequency.value = Math.random() * 300 + 200;
    sine.connect(env);

    const now = audioContext.currentTime; // second
    sine.start(now);
    sine.stop(now + 2);
    // schedule envelop
    const gain = Math.random();

    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(gain, now + 0.01);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 2);
  };
  // create a new sound every time the trigger button is clicked
  $trigger.addEventListener('click', triggerSine);
}

$start.addEventListener('click', init);
