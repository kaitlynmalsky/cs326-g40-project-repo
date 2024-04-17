/**
 * @class View
 * @classdesc The base `View` class
 */
export default class View {
  constructor() {}

  /**
   * Render the view content
   */
  render() {
    console.error('Render function should be overloaded!!');
  }

  /**
   * Manipulate view after DOM elements have been rendered and attached
   */
  onLoad() {}
}
