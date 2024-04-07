export default class NavigationEvent extends Event {
  constructor(navTarget) {
    super('navigate');
    this.navTarget = navTarget;
  }
}
