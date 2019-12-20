import { Experience } from '@soundworks/core/client';
import { render, html } from 'lit-html';
import renderAppInitialization from '../views/renderAppInitialization';
import StepEngine from './StepEngine';
import masters from 'waves-masters';

class PlayerExperience extends Experience {
  constructor(client, config = {}, $container, audioContext) {
    super(client);

    this.config = config;
    this.$container = $container;
    this.audioContext = audioContext;

    // require services
    this.sync = this.require('sync');
    this.audioBufferLoader = this.require('audio-buffer-loader');
    this.checkin = this.require('checkin');
    this.platform = this.require('platform');

    this.engines = {};

    // default initialization views
    renderAppInitialization(client, config, $container);
  }

  async start() {
    super.start();

    this.globals = await this.client.stateManager.attach('globals');

    // define listeners to react to GUI interaction
    this.listeners = {
      toggleStep: (name, index) => {
        const scores = this.globals.get('scores');
        const score = scores[name];
        score[index] = 1 - score[index];

        this.globals.set({ 'scores': scores });
      },
    };

    // instanciate a scheduler that runs in the synchronized clock
    const scheduler = new masters.Scheduler(() => this.sync.getSyncTime(), {
      currentTimeToAudioTimeFunction: syncTime => {
        return this.sync.getLocalTime(syncTime);
      },
    });

    // instanciate engines for each score in `score` (cf. `src/server/schemas/globals`)
    const bpm = this.globals.get('bpm');
    const scores = this.globals.get('scores');
    const buffers = this.audioBufferLoader.data;
    const clientIndex = this.checkin.state.get('index');
    const period = 60 / bpm;
    const syncTime = this.sync.getSyncTime();

    for (let name in scores) {
      const score = scores[name];
      const buffer = buffers[name];
      const activeStep = clientIndex % score.length;
      const engine = new StepEngine(this.audioContext, period, buffer, activeStep);
      engine.score = scores[name];
      engine.connect(this.audioContext.destination);
      // define the next step to call the engine at the right time
      const nextStepTime = Math.floor(syncTime / period) * period + period;
      scheduler.add(engine, nextStepTime);

      this.engines[name] = engine;
    }

    // react to state updates, e.g. when the score is updated by another player
    this.globals.subscribe(updates => {
      for (let name in updates) {
        switch (name) {
          case 'scores':
            const scores = updates['scores'];

            for (let name in scores) {
              this.engines[name].score = scores[name];
            }
            break;
          case 'volume':
            audioBus.volume = updates['volume'];
            break;
        }
      }

      this.renderApp();
    });

    // render the application
    this.renderApp();
  }

  renderApp() {
    const scores = this.globals.get('scores');

    // loop through scores to display their current state
    render(html`
      <div class="screen" style="box-sizing: border-box; padding: 20px">
        <h1 class="title">index: ${this.checkin.state.get('index')}</h1>
        <div>
          <h2>scores</h2>
          ${Object.keys(scores).map(name => {
            const score = scores[name];

            return html`
              <div>
                <label style="display: inline-block; width: 50px">${name}</label>
                ${score.map((value, index) => {
                  return html`
                    <input
                      type="checkbox"
                      .checked="${value === 1}"
                      @click=${e => this.listeners.toggleStep(name, index)}
                    />
                  `
                })}
              </div>
            `
          })}
        </div>
      </div>
    `, this.$container);
  }
}

export default PlayerExperience;
