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
   * Dispatch a login event
   */
  login() {
    this.dispatchEvent(new CustomEvent('login'));
  }

  /**
   * Dispatch a logout event
   */
  logout() {
    this.dispatchEvent(new CustomEvent('logout'));
  }

  /**
   * @param {["navigate" | "login" | "logout", ...*]} args
   */
  addEventListener(...args) {
    // @ts-ignore
    super.addEventListener(...args);
  }
}

const GlobalEvents = new Events();
export default GlobalEvents;
