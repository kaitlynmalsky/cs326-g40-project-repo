import View from '../View.js';
import ExistingPin from './ExistingPin.js';
import EditingPin from './EditingPin.js';
import localStorageInstance from '../database.js';

export default class MapView extends View {
  #map;
  #pins = {};
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
    const btnDiv = document.createElement('div');
    btnDiv.id = 'create-pin';
    btnDiv.className = 'leaflet-bottom leaflet-right';
    btnDiv.style.pointerEvents = 'auto';
    btnDiv.innerHTML = `
    <button class="button-action">Add Pin</button>
    `;
    btnDiv.onclick = () => {
      console.log('Clicked FAB');
      if (!this.editingPin) {
        this.createNewPin();
      }
    };

    elm.appendChild(leafletElm);
    elm.appendChild(btnDiv);

    return elm;
  }

  /**
   * Initializes map view on load.
   */
  async onLoad() {
    this.setView(42.3868, -72.5293, 17);

    const pins = await localStorageInstance.getAllPins();

    for (const pin of pins) {
      this.addPin(pin);
    }
  }

  /**
   * 
   */
  createNewPin() {
    this.editingPin = new EditingPin(this);
    this.editingPin.render();
  }

  async savePin(pinInfo) {
    const pinData = await localStorageInstance.addPin(pinInfo);
    this.addPin(pinData);
    this.editingPin = null;
  }

  addPin(pinInfo) {
    console.log('Adding pin', pinInfo);
    const pin = new ExistingPin(this, pinInfo);
    this.#pins[pin.id] = pin;
    pin.render();
  }

  setView(x, y, zoom) {
    this.#map = L.map('leaflet').setView([x, y], zoom);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.#map);
  }

  /**
   * 
   * @param {string} imageLink 
   * @param {number} x 
   * @param {number} y 
   * @param {Object} options 
   * @returns 
   */
  createMarker = (imageLink, x, y, options) => {
    // use marker.option to change options in the future
    const newIcon = L.icon({
      iconUrl: imageLink,

      iconSize: [50, 50], // size of the icon
      //   shadowSize: [50, 50], // size of the shadow
      iconAnchor: [25, 50], // point of the icon which will correspond to marker's location
      //   shadowAnchor: [4, 92], // the same for the shadow
      popupAnchor: [0, -50], // point from which the popup should open relative to the iconAnchor
    });
    return L.marker([x, y], {
      icon: newIcon,
      riseOnHover: true,
      ...options,
    }).addTo(this.#map);
  };

  /**
   * Creates a marker in the center of the map, determined by the current map display.
   * @param {string} imageLink 
   * @param {string} shadowLink 
   * @param {Object} options 
   * @returns 
   */
  createCenterMarker(imageLink, shadowLink, options) {
    return this.createMarker(
      imageLink,
      shadowLink,
      this.#map.getCenter().lat,
      this.#map.getCenter().lng,
      options,
    );
  }
}
