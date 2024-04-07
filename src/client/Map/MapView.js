import View from '../View.js';

export default class MapView extends View {
  #map = null;

  constructor() {
    super();
  }

  async render() {
    const elm = document.createElement('div');
    elm.id = 'map';

    return elm;
  }

  async onLoad() {
    await this.setView(42.3868, -72.5293, 17);
    const testMarker = this.createMarker(
      'src/docs/milestone-01/images/batman.png',
      'src/docs/milestone-01/images/shadowcircletemp.png',
      42.3868,
      -72.5293,
    );
  }

  async setView(x, y, zoom) {
    this.#map = L.map('map').setView([x, y], zoom);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.#map);
  }

  // createIcon(imageLink, shadowLink) {
  //     return L.icon({
  //         iconUrl: imageLink,
  //         shadowUrl: shadowLink,

  //         iconSize:     [38, 95], // size of the icon
  //         shadowSize:   [50, 64], // size of the shadow
  //         iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
  //         shadowAnchor: [4, 62],  // the same for the shadow
  //         popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  //     });
  // }

  createMarker(imageLink, shadowLink, x, y) {
    const newIcon = L.icon({
      iconUrl: imageLink,
      shadowUrl: shadowLink,

      iconSize: [38, 95], // size of the icon
      shadowSize: [50, 64], // size of the shadow
      iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62], // the same for the shadow
      popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
    });
    return L.marker([x, y], { icon: newIcon }).addTo(this.#map);
  }
}
