import '@babel/polyfill';
import loaders from 'waves-loaders';
import masters from 'waves-masters';
import resumeContext from './resumeContext.js';
import StepEngine from './StepEngine.js';
import { render, html } from 'lit-html';

async function init() {
  const audioContext = new AudioContext();
  // resume audio context
  await resumeContext(audioContext);

  const score = [];
  const BPM = 120;
  const numSteps = 8;

  const filenames = [
    '909-BD-high.wav',
    '909-CY-crash.wav',
    '909-HH-closed.wav',
    '909-HT-low.wav',
    '909-LT-low.wav',
    '909-MT-low.wav',
    '909-PC-clap.wav',
    '909-PC-rimshot.wav',
    '909-SD-low.wav',
  ];

  // load files

  // create a score

  // create engine and scheduler

  // ----------------------------------------------------------
  // add controls
  // ----------------------------------------------------------
  const $container = document.querySelector('#score');
  const $interface = [];

  const $bpm = html`
    <div>
      <p>bpm</p>
      <input
        type="number"
        value="${BPM}"
      />
    </div>
  `;

  $interface.push($bpm);

  filenames.forEach((filename, index) => {
    const track =  score[index];

    const $track = html`
      <div>
        <label style="display: inline-block; width: 200px">${filename}</label>
        ${track.map((value, index) => {
          return html`
            <input
              type="checkbox"
              ?checked="${track[index]}"
            >
          `;
        })}
      </div>
    `;

    $interface.push($track);
  });

  render($interface, $container);
}

// wait for the page to be fully loaded before launching app
window.addEventListener('load', init);
