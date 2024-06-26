import View from '../View.js';
import ExistingPin from './ExistingPin.js';
import EditingPin from './EditingPin.js';
import api from '../api.js';
import Pin from './Pin.js';

/**
 * @typedef {import('leaflet')} Leaflet
 */

/**
 * @typedef {import('leaflet').Map} LeafletMap
 */

/**
 * @typedef {import('leaflet').Marker} LeafletMarker
 */

const L = /** @type {Leaflet} */ window.L;

/**
 * The MapView view
 * @extends View
 */
export default class MapView extends View {
  /**
   * @type {LeafletMap}
   */
  #map;
  /**
   * @type {Object.<string, Pin>}
   */
  #pins = {};
  /**
   * @type {HTMLButtonElement}
   */
  #fabElm;
  /**
   * The pin currently being edited
   * @type {?EditingPin}
   */
  editingPin = null;

  constructor() {
    super();
  }

  /**
   * Returns a promise containing an HTML element containing the map view.
   * @returns {Promise<HTMLElement>}
   */
  async render() {
    // Create component root
    const elm = document.createElement('div');
    elm.id = 'map-view';

    // Create leaflet holder
    const leafletElm = document.createElement('div');
    leafletElm.id = 'leaflet';

    // Create pin FAB
    const fabElm = document.createElement('button');
    const fabClass = `leaflet-bottom leaflet-right bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 border-b-4 border-red-800 hover:border-red-900 rounded`;
    fabElm.id = 'map-fab';
    fabElm.className = fabClass;
    fabElm.style.pointerEvents = 'auto';
    fabElm.innerText = 'Add Pin';

    fabElm.onclick = () => {
      if (!this.editingPin) {
        this.createNewPin();
      } else {
        this.cancelPin();
      }
    };
    this.#fabElm = fabElm;

    elm.appendChild(leafletElm);
    elm.appendChild(fabElm);

    return elm;
  }

  /**
   * Initializes map view on load.
   */
  async onLoad() {
    this.setView(42.3868, -72.5293, 17);

    this.loadPins();

    setInterval(() => this.loadPins(), 1000 * 60); // Refresh pins every minute
  }

  async loadPins() {
    // Clear existing pins
    for (const pinID in this.#pins) {
      this.#pins[pinID].removeMarker();
      delete this.#pins[pinID];
    }

    // Add pins
    const pins = await api.getUpcomingPins();

    for (const pin of pins) {
      this.addPin(pin);
    }
  }

  /**
   * Sets up the MapView for new pin creation
   */
  createNewPin() {
    this.editingPin = new EditingPin(this);
    this.#fabElm.innerText = 'Cancel';
    this.editingPin.render();
  }

  /**
   *  Sets up the MpaView to edit a pin
   * @param {string} pinID
   */
  async editPin(pinID) {
    const pin = await api.getPin(pinID);

    if (this.editingPin) {
      this.editingPin.cancel();
    }

    this.editingPin = new EditingPin(this, 'existing', pin);
    this.#fabElm.innerText = 'Cancel';
    this.editingPin.render();
    this.#pins[pinID].removeMarker();
  }

  /**
   * Delete a pin
   * @param {import('../api.js').Pin} pin
   */
  async deletePin(pin) {
    await api.deletePin(pin);
    this.#pins[pin.pinID].removeMarker();
    delete this.#pins[pin.pinID];
  }

  /**
   * Saves a new pin to the database and calls addPin to add it to map
   * @param { import('../api.js').CreatePinInput} pinInfo
   */
  async savePin(pinInfo) {
    const pinData = await api.createPin(pinInfo);
    this.#fabElm.innerText = 'Add Pin';
    await this.addPin(pinData);
    this.editingPin = null;
  }

  /**
   * Update a pin
   * @param {import('../api.js').Pin} pin
   */
  async updatePin(pin) {
    const pinData = await api.updatePin(pin);
    this.#fabElm.innerText = 'Add Pin';
    this.addPin(pinData);
    this.editingPin = null;
  }

  /**
   * Cancel pin editing
   */
  cancelPin() {
    this.editingPin.cancel();
    this.#fabElm.innerText = 'Add Pin';
    this.editingPin = null;
  }

  /**
   * Adds an existing or created pin to the map
   * @param {import('../api.js').Pin} pinInfo
   */
  async addPin(pinInfo) {
    const pin = new ExistingPin(this, pinInfo);
    this.#pins[pin.id] = pin;
    await pin.render();
  }

  /**
   * Sets up the Leaflet view
   * @param {number} lat
   * @param {number} lng
   * @param {number} zoom
   */
  setView(lat, lng, zoom) {
    this.#map = L.map('leaflet').setView([lat, lng], zoom);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.#map);
  }

  /**
   * Create a Leaflet marker
   * @param {string} imageLink
   * @param {number} lat
   * @param {number} lng
   * @param {boolean} editing
   * @param {Object} options
   * @returns {LeafletMarker}
   */
  createMarker = (imageLink, editing, lat, lng, options) => {
    // use marker.option to change options in the future
    const newIcon = L.icon({
      iconUrl: imageLink,
      iconSize: [50, 50], // size of the icon
      iconAnchor: [25, 50], // point of the icon which will correspond to marker's location
      popupAnchor: [0, -50], // point from which the popup should open relative to the iconAnchor
      className: editing
        ? 'border-green-700 border-2 rounded-full border-dashed'
        : 'rounded-full',
    });

    return L.marker([lat, lng], {
      icon: newIcon,
      riseOnHover: true,
      ...options,
    }).addTo(this.#map);
  };

  /**
   * Creates a marker in the center of the map, determined by the current map display.
   * @param {string} imageLink
   * @param {boolean} editing
   * @param {Object} options
   * @returns
   */
  createCenterMarker(imageLink, editing, options) {
    return this.createMarker(
      imageLink,
      editing,
      this.#map.getCenter().lat,
      this.#map.getCenter().lng,
      options,
    );
  }
}
