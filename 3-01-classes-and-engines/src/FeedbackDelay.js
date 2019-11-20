import { audioContext } from 'waves-audio';

/**
 * Feedback Delay class that could be simply reused in any audio chain.
 */
class FeedbackDelay {
  constructor(delayTime = 0.1, feedback = 0.9, preGain = 0.5) {
    this.input = audioContext.createGain();
    this.output = audioContext.createGain();

    this._preGain = audioContext.createGain();
    this._delay = audioContext.createDelay();
    this._feedback = audioContext.createGain();

    this.input.connect(this.output);
    this.input.connect(this._preGain);
    this._preGain.connect(this._delay);
    this._delay.connect(this.output);
    this._delay.connect(this._feedback);
    this._feedback.connect(this._delay);

    // initialize with default values
    this.setDelayTime(delayTime);
    this.setFeedback(feedback);
    this.setPreGain(preGain);
  }

  setDelayTime(value) {
    this._delay.delayTime.value = value;
  }

  getDelayTime() {
    return this._delay.delayTime.value;
  }

  setFeedback(value) {
    const now = audioContext.currentTime;
    this._feedback.gain.linearRampToValueAtTime(value, now + 0.01);
  }

  getFeedback() {
    return this._feedback.gain.value;
  }

  setPreGain(value) {
    const now = audioContext.currentTime;
    this._preGain.gain.linearRampToValueAtTime(value, now + 0.01);
  }

  getPreGain() {
    return this._preGain.gain.value;
  }

  connect(dest) {
    this.output.connect(dest);
  }
}

export default FeedbackDelay;
