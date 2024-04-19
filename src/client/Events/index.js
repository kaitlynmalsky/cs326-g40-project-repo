import NavigationEvent from './NavigationEvent.js';

/**
 * @class
 */
class Events extends EventTarget {
  /**
   * Dispatches a `NavigationEvent` to the provided routeKey
   * @param {string} to
   */
  navigate(to) {
    this.dispatchEvent(new NavigationEvent(to));
  }

  /**
   * @param {["navigate", ...*]} args
   */
  addEventListener(...args) {
    // @ts-ignore
    super.addEventListener(...args);
  }
}

const GlobalEvents = new Events();
export default GlobalEvents;
