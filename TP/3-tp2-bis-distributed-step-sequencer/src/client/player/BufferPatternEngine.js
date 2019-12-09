import { audio } from 'soundworks/client';

const audioContext = audio.audioContext;

/**
 * Engine that parse a `pattern` in time and play a given `buffer` when
 * the value of the `pattern` at `patternIndex` is equal to 1
 */
class BufferPatternEngine extends audio.TimeEngine {
  constructor(sync, pattern, buffer) {
    super();

    this.sync = sync;
    this.buffer = buffer;
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
      const src = audioContext.createBufferSource();
      src.buffer = this.buffer;
      src.connect(audioContext.destination);

      src.start(audioTime);
    }

    this.patternIndex = (this.patternIndex + 1) % this.pattern.length;

    return syncTime + this.period;
  }
}

export default BufferPatternEngine;

