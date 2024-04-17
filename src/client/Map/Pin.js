import MapView from './MapView.js';

/**
 * The default Pin class
 * @class
 * @constructor
 */
export default class Pin {
  /**
   * Reference to the parent MapView
   * @type {MapView}
   */
  map;
  timeClass = `bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5`;
  detailsClass =
    'bg-gray-50 border border-gray-300 block mb-2 text-sm text-gray-900 text-black rounded-lg p-2';
  buttonClass =
    'bg-orange-700 hover:bg-orange-600 text-white font-bold py-2 px-4 border-b-4 border-orange-800 hover:border-orange-900 rounded w-auto';

  /**
   * Constructor for Pin
   * @param {MapView} map
   */
  constructor(map) {
    this.map = map;
  }

  addToMap() {
    this.placeMarker();
  }

  render() {
    console.error('Forgot to override render!');
  }

  placeMarker() {
    console.error('Forgot to override placeMarker');
  }
}
