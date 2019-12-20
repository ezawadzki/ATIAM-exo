// singleton pattern

// in Java, C++, etc.
let instance = null

class App {
  private constructor() {
    this.stuff = 'stuff';
  }

  static getInstance() {
    if (!instance) {
      instance = new App();
    }

    return instance;
  }
}

const app = App.getInstance();
// const app = new App();


// in Javascript
const app = {
  stuff: 'stuff';
};
