import { audio } from 'soundworks/client';

const audioContext = audio.audioContext;

/**
 * Engine that parse a `pattern` in time and play a sine at a given `frequency`
 *  when the value of the `pattern` at `patternIndex` is equal to 1
 */
class SinePatternEngine extends audio.TimeEngine {
  constructor(sync, pattern, frequency) {
    super();

    this.sync = sync;
    this.frequency = frequency;
    this.pattern = pattern;
    this.patternIndex = 0;
    this.period = Infinity;
  }

  /**
   * Mandatory method for usage in the `waves-audio` scheduler
   * As the scheduler runs in the synchronized time provided by the `sync`
   * service, we need to convert to `audioTime` for scheduling audio events
   * properly.
   */
  advanceTime(syncTime) {
    if (this.pattern[this.patternIndex] === 1) {
      const audioTime = this.sync.getAudioTime(syncTime);

      const env = audioContext.createGain();
      env.connect(audioContext.destination);
      env.gain.setValueAtTime(0, audioTime);
      env.gain.linearRampToValueAtTime(1, audioTime + 0.01);
      env.gain.exponentialRampToValueAtTime(0.0001, audioTime + 0.5);

      const sine = audioContext.createOscillator();
      sine.connect(env);
      sine.frequency.value = this.frequency;

      sine.start(audioTime);
      sine.stop(audioTime + 0.5);
    }

    this.patternIndex = (this.patternIndex + 1) % this.pattern.length;

    return syncTime + this.period;
  }
}

export default SinePatternEngine;

