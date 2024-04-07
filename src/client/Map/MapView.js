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
      './images/placeholder_avatar.png',
      './images/shadowcircletemp.png',
      42.3868,
      -72.5293,
    );
    this.bindPopup(testMarker, `<p>This is some <strong>text</strong></p>`);
    let startTimeInput = 'start-time-input-1';
    let endTimeInput = 'end-time-input-1';
    let detailInput = 'detail-input-1';
    let postButton = 'post-button-1';
    this.bindPopupTemplate(
      testMarker,
      startTimeInput,
      endTimeInput,
      detailInput,
      postButton,
    );
    this.showPopup(testMarker);
  }

  async setView(x, y, zoom) {
    this.#map = L.map('map').setView([x, y], zoom);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.#map);
  }

  createMarker = (imageLink, shadowLink, x, y) => {
    const newIcon = L.icon({
      iconUrl: imageLink,
      //   shadowUrl: shadowLink,

      iconSize: [50, 50], // size of the icon
      //   shadowSize: [50, 50], // size of the shadow
      iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
      //   shadowAnchor: [4, 92], // the same for the shadow
      popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
    });
    return L.marker([x, y], { icon: newIcon }).addTo(this.#map);
  };

  bindPopup(marker, content) {
    marker.bindPopup(content);
  }
  bindPopupTemplate(marker, start, end, detail, post) {
    marker.bindPopup(
      `<div class="pin-label-text"><strong>New Pin</strong></div><br><br>
            <label for="${start}" class="pin-label-text">Start time:</label>
            <input type="time" id="${start}"/><br>
            <label for="${end}" class="pin-label-text">End time:</label>
            <input type="time" id="${end}"/><br>
            <label for="${detail}" class="pin-label-text">Details:</label><br>
            <textarea id="${detail}" rows="4" cols="30"></textarea><br>
            <input type="button" id="${post}" class="pin-button" value="Post"/>
            `,
      { className: 'customPopup' },
    );
    this.updatePopupCSS();
  }

  showPopup(marker) {
    marker.openPopup();
  }

  updatePopupCSS() {
    let popupElement = document.getElementsByClassName(
      'leaflet-popup-content-wrapper',
    );
    let htmlPopupElement;
    if (popupElement[0] instanceof HTMLElement) {
      htmlPopupElement = popupElement[0];
      htmlPopupElement.style.backgroundColor = 'bisque';
      console.log(htmlPopupElement);
    }
  }
}
