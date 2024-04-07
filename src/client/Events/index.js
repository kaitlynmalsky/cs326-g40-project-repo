import NavigationEvent from './NavigationEvent.js';

class Events extends EventTarget {
  navigate(to) {
    this.dispatchEvent(new NavigationEvent(to));
  }
}

const GlobalEvents = new Events();
export default GlobalEvents;
