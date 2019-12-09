const url = window.location.origin.replace('http', 'ws');
const socket = new WebSocket(url);
socket.binaryType = 'arraybuffer';

socket.addEventListener('open', () => {
  updateState();
});

socket.addEventListener('message', (e) => {
  const index = new Uint8Array(e.data)[0];
  updateState(0, index);
});

socket.addEventListener('error', () => {});
socket.addEventListener('close', () => {});

const states = ['html', 'css', 'javascript'];

const tmpls = {
  html: `
<h2>Some Title</h2>
<ul>
  <li>item 1</li>
  <li>item 2</li>
  <li>item 3</li>
  <li>item 4</li>
</ul>
    `,

  css: `
h2 {
  font-size: 30px;
  font-weight: normal;
  color: #868686;
  font-family: "Lucida Sans Unicode";
  // ...
}

ul {
  list-style-type: none;
  // ...
}

ul li {
  width: 70%;
  height: 30px;
  text-align: center;
  background-color: steelblue;
  // ...
}
`,

  javascript: `
const $elms = document.querySelectorAll('li');
const list = Array.from($elms);

let counter = 0;
let timeoutId = null;

(function hide() {
  list.forEach(($el, index) => {
    $el.classList.remove('hide');

    if (index === counter)
      $el.classList.add('hide');
  });

  counter = (counter += 1) % list.length;
  timeoutId = setTimeout(hide, 1000);
}());
`,
  };

const txt = 'Hello';
const msg = `${txt} World`;

let index = 0;
const $container = document.querySelector('#container');
const $next = document.querySelector('#next');
const $prev = document.querySelector('#prev');
const $title = document.querySelector(('#state'));
const $code = document.querySelector(('code'));
const $list = Array.from(document.querySelectorAll('li'));

function updateState(inc = 0, _index = null) {
  if (_index === null)
    index = (index += inc) % states.length;
  else
    index = _index;

  if (index < 0)
    index = states.length - 1;


  // propagate state on the network
  if (_index === null) {
    const msg = new Uint8Array(1);
    msg[0] = index;
    socket.send(msg);
  }
  // update controls title
  const state = states[index];
  $title.textContent = state[0].toUpperCase() + state.slice(1);
  $container.classList.remove('css', 'javascript');

  if (state === 'html') {
    stopAnimation();
  } else if (state === 'css') {
    $container.classList.add('css');
    stopAnimation();
  } else if (state === 'javascript') {
    $container.classList.add('css', 'javascript');
    triggerAnimation();
  }

  const tmpl = tmpls[state];
  $code.textContent = tmpl;
}

let timeoutId = null;

function triggerAnimation() {
  let counter = 0;

  (function hide() {
    $list.forEach(($el, index) => {
      $el.classList.remove('hide');

      if (index === counter)
        $el.classList.add('hide');
    });

    counter = (counter += 1) % $list.length;
    timeoutId = setTimeout(hide, 1000);
  }());
}

function stopAnimation() {
  clearTimeout(timeoutId);
  $list.forEach($el => $el.classList.remove('hide'));
}

function startApp() {
  updateState();
}

// bind controls
$next.addEventListener('click', () => updateState(1));
$prev.addEventListener('click', () => updateState(-1));

document.body.addEventListener('keydown', (e) => {
  const code = e.keyCode;

  if (code === 37) // left
    updateState(-1);
  else if (code === 39) // right
    updateState(1);
});



