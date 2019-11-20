import { audioContext, getScheduler } from 'waves-audio';
import * as controllers from '@ircam/basic-controllers';
import resumeContext from './resumeContext';
import PeriodicSineEngine from './PeriodicSineEngine';
import FeedbackDelay from './FeedbackDelay';

/**
 * Based on the exercice given in level-1, this example show how to structure
 * the code in order to create reusable components.
 */

async function init() {
  // the resume context function is a helper that allows to simply force
  // the user to resume the audio context through a gesture
  try {
    await resumeContext(audioContext);
  } catch(err) {
    alert('sorry its broken');
  }

  /**
   * we create an audio chain composed of higher level components
   * `PeriodicSineEngine` and `FeedbackDelay`. These components could be
   * seemlessly integrated in a more complex audio chain.
   */
  const engine = new PeriodicSineEngine(1);
  const feedbackDelay = new FeedbackDelay();

  feedbackDelay.setDelayTime(0.2);

  engine.connect(feedbackDelay.input);
  feedbackDelay.connect(audioContext.destination);

  /**
   * The scheduler provided by the `waves-audio` library
   * (https://github.com/wavesjs/waves-audio)
   * allow to simply and precisely schedule (audio) events in time.
   */
  const scheduler = getScheduler();
  scheduler.add(engine);

  // create gui
  new controllers.Slider({
    label: 'period',
    min: 0.01,
    max: 4,
    step: 0.01,
    default: 1,
    container: '#container',
    callback: (value) => {
      engine.period = value;
    }
  });

  new controllers.Slider({
    label: 'feedback',
    min: 0,
    max: 1,
    step: 0.001,
    default: 0.9,
    container: '#container',
    callback: (value) => {
      feedbackDelay.setFeedback(value);
    }
  });
}

window.addEventListener('load', init);
