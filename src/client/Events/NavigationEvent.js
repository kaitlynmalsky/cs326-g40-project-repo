export default class NavigationEvent extends Event {
  /**
   * 
   * @param {string} navTarget The navigation target
   */
  constructor(navTarget) {
    super('navigate');
    this.navTarget = navTarget;
  }
}
