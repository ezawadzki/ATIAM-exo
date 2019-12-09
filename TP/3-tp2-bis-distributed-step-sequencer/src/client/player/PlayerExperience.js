import * as soundworks from 'soundworks/client';
import SinePatternEngine from './SinePatternEngine';
import BufferPatternEngine from './BufferPatternEngine';

const audioContext = soundworks.audioContext;
const audio = soundworks.audio;

// this is the template use to display the html view.
const template = `
  <div class="foreground">
    <div class="section-top flex-middle"></div>
    <div class="section-center flex-center">
      <div>
      <% for (var i = 0; i < pattern.length; i++) { %>
        <input class="beat" type="checkbox" data-index="<%= i %>"<%= pattern[i] === 1 ? ' checked' : '' %> />
      <% } %>
      <br />
      <% if (frequency !== null) { %>
      frequency
      <input id="frequency" type="range" min="100" max="1000" step="1" value="<%= frequency %>" />
      <% } %>
      </div>
    </div>
    <div class="section-bottom flex-middle"></div>
  </div>
`;

class PlayerExperience extends soundworks.Experience {
  constructor(assetsDomain) {
    super();

    // require all needed services
    this.platform = this.require('platform', { features: ['web-audio'] });
    this.checkin = this.require('checkin', { showDialog: false });
    this.sharedParams = this.require('shared-params');

    this.sync = this.require('sync');
    this.syncScheduler = this.require('sync-scheduler');

    this.audioBufferManager = this.require('audio-buffer-manager', {
      assetsDomain: assetsDomain,
      files: [
        'sounds/clicks/click.mp3',
        'sounds/clicks/clack.mp3',
        'sounds/clicks/clock.mp3',
      ],
    });

    this.pattern = null;
    this.view = null;
    this.patternEngine = null;
  }

  /**
   * is called when all required services are `ready`, at this point we are
   * sure that we can use all the services safely.
   */
  async start() {
    super.start();

    // data structure to host the pattern played by the player
    this.pattern = [1, 0, 0, 1, 0, 0, 1, 0];

    // create the view using the template and some data (here the `this.pattern`)
    // listen for events from the view to update behavior
    this.view = new soundworks.SegmentedView(template, {
      pattern: this.pattern,
      frequency: null,
    }, {
      'click .beat': (e) => {
        const $el = e.target;
        const index = parseInt($el.dataset.index);
        const value = $el.checked ? 1 : 0;

        this.pattern[index] = value;
      },
      'input #frequency': (e) => {
        const $el = e.target;
        const frequency = parseInt($el.value);

        this.patternEngine.frequency = frequency;
      },
    }, {});

    // show the view (this is asynchronous)
    await this.show();

    // listen for the shared parameters (see `server/index.js` and `controller` client)
    // when the callback is added to the service, it is immediatly executed,
    // allowing to setup the client accroding to the current state of the application.
    this.sharedParams.addParamListener('synthType', (value) => this.updateSynthType(value));
    this.sharedParams.addParamListener('BPM', () => this.updateEnginePeriod());
    this.sharedParams.addParamListener('numBeats', () => this.updateEnginePeriod());
  }

  /**
   * This method allows to change the type of synthesis used (`sine` or `buffer`)
   * according to the `synthType` shared parameters.
   */
  updateSynthType(synthType) {
    // if and engine is in the scheduler, we remove it (a synth cannot be added)
    // twice in the scehduler.
    if (this.patternEngine && this.patternEngine.master) {
      this.syncScheduler.remove(this.patternEngine);
    }

    // we instanciate a synth (or engine) according to the value of the
    // `synthType` shared parameter.
    // As both synth share the same API, at this level, they can be used
    // interchangeably
    if (synthType === 'buffer') {
      const buffers = this.audioBufferManager.data;
      const bufferIndex = soundworks.client.index % buffers.length;
      const buffer = buffers[bufferIndex];

      this.view.model.frequency = null;
      this.patternEngine = new BufferPatternEngine(this.sync, this.pattern, buffer);
    } else {
      const frequencies = [200, 300, 430, 513, 560];
      const partialIndex = soundworks.client.index % frequencies.length;
      const frequency = frequencies[partialIndex];

      this.view.model.frequency = frequency;
      this.patternEngine = new SinePatternEngine(this.sync, this.pattern, frequency);
    }

    // we update the view and call `updateEnginePeriod` to reschedule the new
    // synth properly.
    this.view.render();
    this.updateEnginePeriod();
  }

  /**
   * This method is dedicated to schedule the engine to make sure that
   * every clients are synchronized on a common beat and a the same position
   * in the `pattern` loop.
   */
  updateEnginePeriod() {
    // if and engine is in the scheduler, we remove it (a synth cannot be added)
    // twice in the scehduler.
    if (this.patternEngine && this.patternEngine.master) {
      this.syncScheduler.remove(this.patternEngine);
    }

    // calculate the current period accoring to the `BPM` and `numBeats`
    // shared params.
    const BPM = this.sharedParams.getValue('BPM');
    const numBeats = this.sharedParams.getValue('numBeats');
    const period = (60 / BPM) / numBeats;

    // define the `patternIndex` and related synchronized time of the
    // next audio events
    const syncTime = this.sync.getSyncTime();
    const numPeriodSinceOrigin = Math.ceil(syncTime / period);
    const nextPatternIndex = numPeriodSinceOrigin % this.pattern.length;
    const startTime = numPeriodSinceOrigin * period;

    // update the synth with these values
    this.patternEngine.period = period;
    this.patternEngine.patternIndex = nextPatternIndex;
    // ... and add the synth to the scheduler
    this.syncScheduler.add(this.patternEngine, startTime);
  }
}

export default PlayerExperience;
