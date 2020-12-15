class StepEngine {
  constructor(audioContext, soundFiles, score) {
    this.audioContext = audioContext;
    this.soundFiles = soundFiles;
    this.score = score;

    this.period = 120;
    this.currentStep = 0;
    this.numSteps = score[0].length;

    this.output = this.audioContext.createGain();
  }

  set bpm(value) {
    this.period = 60 / value;
  }

  // mimic the API of native audio node to interface w/ "real" world
  connect(node) {
    this.output.connect(node);
  }

  // method that is called periodically by the scheduler
  // the given `time` is the logical time at which an event must be scheduled
  advanceTime(time) {
    this.score.forEach((track, index) => {
      const soundFile = this.soundFiles[index];

      if (track[this.currentStep] === 1) {
        const src = this.audioContext.createBufferSource();
        src.buffer = soundFile;
        src.connect(this.output);
        src.start(time);
      }
    });

    // compute next step
    this.currentStep = (this.currentStep + 1) % this.numSteps;

    return time + this.period;
  }
}

export default StepEngine;
