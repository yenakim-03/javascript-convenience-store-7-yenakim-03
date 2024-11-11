import ConvenienceStore from './ConvenienceStore.js';

class App {
  async run() {
   const store = new ConvenienceStore();
   await store.initialize();
   await store.start();
  }
}

export default App;
