/**
 * @class View
 * @classdesc The base `View` class
 */
export default class View {
  constructor() {}

  /**
   * Render the view content
   * @returns {Promise<HTMLElement>}
   */
  async render() {
    console.error('Render function should be overloaded!!');
    const div = document.createElement('div');
    div.style.background = 'red';
    div.style.color = 'white';
    div.innerText = 'Forgot to override';
    return div;
  }

  /**
   * Manipulate view after DOM elements have been rendered and attached
   */
  onLoad() {}
}
