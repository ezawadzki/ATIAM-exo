# TP2 - Simple Distributed Step Sequencer

source code is located in `src` directory, mainly in `src/clients/player` and `src/server`

```
cd path/to/tp-2-distributed-step-sequencer
npm install
npm run watch
```

clients are accessible at `http://127.0.0.1:8000`, a `player` only plays the sound at `step === index`

To emulate 8 players in one window go to: `http://127.0.0.1:8000/?emulate=8`
