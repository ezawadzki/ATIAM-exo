// PubSub
class EventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  addListener(channel, callback) {
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, new Set());
    }

    const listeners = this.listeners.get(channel);
    listeners.add(callback);
  }

  emit(channel, ...args) {
    const listeners = this.listeners.get(channel);
    listeners.forEach(callback => callback(...args));
  }
}

var eventEmitter = new EventEmitter();

eventEmitter.addListener('test', function(...args) {
  console.log(args);
});

//
eventEmitter.emit('test', 'a', 'b', 'c');
