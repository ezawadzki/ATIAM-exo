import { TimeEngine, audioContext } from 'waves-audio';

/**
 * Simple engine that shows how to implement an engine compliant with the
 * `waves-audio` scheduler API.
 */
class PeriodicSineEngine extends TimeEngine {
  constructor(period = 1, attackTime = 0.01, duration = 1) {
    super();

    this.period = period;
    this.attackTime = attackTime;
    this.duration = duration;

    this.output = audioContext.createGain();
  }

  connect(dest) {
    if (dest instanceof AudioNode) {
      this.output.connect(dest);
    } else {
      throw new Error('give me a AudioNode please');
    }
  }

  /**
   * the `advanceTime` method is required in order to pass the engine to the
   * `waves-audio` scheduler.
   */
  advanceTime(time) {
    const env = audioContext.createGain();
    env.connect(this.output);
    env.gain.setValueAtTime(0, time);
    env.gain.linearRampToValueAtTime(1, time + this.attackTime);
    env.gain.exponentialRampToValueAtTime(0.0001, time + this.duration);

    const sine = audioContext.createOscillator();
    sine.frequency.value = 200 + Math.random() * 200;
    sine.connect(env);

    sine.start(time);
    sine.stop(time + this.duration);

    return time + this.period;
  }
}

export default PeriodicSineEngine;
